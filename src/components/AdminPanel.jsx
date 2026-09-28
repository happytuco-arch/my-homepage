import { useEffect, useRef, useState } from 'react'
import { useAdmin } from '../admin/AdminContext'
import { MEDIA, SIZE_WARN } from '../admin/config'
import {
  clearOtherPins,
  createProject,
  deleteProject,
  updateProject,
  uploadMedia,
} from '../admin/projectsApi'
import { useProjects } from '../lib/useProjects'
import AdminPapers from './AdminPapers'
import AdminAssignments from './AdminAssignments'

const EMPTY = { id: null, title: '', description: '', imageUrl: '', videoUrl: '', pinned: false }

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

/**
 * 관리자 화면 — 작품 등록 · 수정 · 삭제.
 *
 * 저장에 실패하면 입력한 내용을 절대 지우지 않습니다.
 * 파일이 이미 올라간 뒤에 표 저장만 실패한 경우에는 그 파일 주소를 그대로 들고 있어서,
 * 다시 누를 때 같은 파일을 두 번 올리지 않습니다.
 */
export default function AdminPanel({ onClose }) {
  const { logout, user } = useAdmin()
  const { items, status, error: listError, reload } = useProjects()

  // 'work' 작품(projects) / 'paper' 논문(papers)
  const [mode, setMode] = useState('work')
  const [form, setForm] = useState(EMPTY)
  const [files, setFiles] = useState({ image: null, video: null })
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState('')
  const imageRef = useRef(null)
  const videoRef = useRef(null)

  const editing = Boolean(form.id)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  const clearForm = () => {
    setForm(EMPTY)
    setFiles({ image: null, video: null })
    if (imageRef.current) imageRef.current.value = ''
    if (videoRef.current) videoRef.current.value = ''
  }

  const startEdit = (item) => {
    setForm({
      id: item.id,
      title: item.title,
      description: item.description,
      imageUrl: item.imageRaw || '',
      videoUrl: item.videoRaw || '',
      pinned: Boolean(item.pinned),
    })
    setFiles({ image: null, video: null })
    setError('')
    setDone('')
  }

  const pickFile = (kind, file) => {
    setError('')
    setDone('')
    if (file && file.size > SIZE_WARN) {
      setError(`파일이 큽니다 (${formatSize(file.size)}). Supabase 가 거절할 수 있습니다.`)
    }
    setFiles((f) => ({ ...f, [kind]: file ?? null }))
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('제목을 입력해 주세요.')
      return
    }

    setError('')
    setDone('')

    // 지금 화면의 값에서 시작해, 성공한 단계마다 갱신해 둡니다.
    // 중간에 실패해도 여기까지의 결과가 폼에 남아 다시 하지 않아도 됩니다.
    let next = { ...form }

    try {
      for (const kind of ['image', 'video']) {
        const file = files[kind]
        if (!file) continue

        setBusy(`${MEDIA[kind].label} 올리는 중…`)
        const { url } = await uploadMedia(kind, file)

        next = { ...next, [kind === 'image' ? 'imageUrl' : 'videoUrl']: url }
        setForm(next)
        setFiles((f) => ({ ...f, [kind]: null }))
        if (kind === 'image' && imageRef.current) imageRef.current.value = ''
        if (kind === 'video' && videoRef.current) videoRef.current.value = ''
      }

      setBusy(editing ? '수정하는 중…' : '등록하는 중…')
      const saved = editing ? await updateProject(next.id, next) : await createProject(next)

      // '항상 첫 번째' 는 한 작품만 가질 수 있습니다
      if (next.pinned) await clearOtherPins(saved.id)

      setDone(editing ? '수정했습니다.' : '등록했습니다.')
      clearForm()
      await reload()
    } catch (err) {
      // ← 입력한 내용은 그대로 둡니다
      setError(err.message)
    } finally {
      setBusy('')
    }
  }

  const remove = async (item) => {
    if (!window.confirm(`"${item.title}" 을(를) 지울까요? 되돌릴 수 없습니다.`)) return
    setError('')
    setDone('')
    try {
      setBusy('지우는 중…')
      await deleteProject(item.id)
      if (form.id === item.id) clearForm()
      setDone('지웠습니다.')
      await reload()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy('')
    }
  }

  return (
    <div
      className="overlay"
      role="dialog"
      aria-modal="true"
      aria-label="작품 관리"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <button className="detail__close" onClick={onClose}>
        Close ✕
      </button>

      <div className="adminbox adminbox--panel">
        <header className="adminbox__head">
          <div>
            <p className="kicker">Admin · {user?.email}</p>
            <h2 className="adminbox__title">
              {mode === 'paper'
                ? '논문 등록'
                : mode === 'assignment'
                  ? '과제 등록'
                  : editing
                    ? '작품 수정'
                    : '작품 등록'}
            </h2>
          </div>
          <button
            className="btn-ghost"
            type="button"
            onClick={async () => {
              await logout()
              onClose()
            }}
          >
            로그아웃
          </button>
        </header>

        {/* 무엇을 등록할지 — 작품 / 논문 */}
        <div className="adminform__kinds" role="group" aria-label="등록 갈래">
          <button
            type="button"
            className={`kindtab${mode === 'work' ? ' is-active' : ''}`}
            onClick={() => setMode('work')}
            aria-pressed={mode === 'work'}
          >
            작품<span>사진 · 영상</span>
          </button>
          <button
            type="button"
            className={`kindtab${mode === 'paper' ? ' is-active' : ''}`}
            onClick={() => setMode('paper')}
            aria-pressed={mode === 'paper'}
          >
            논문<span>DOI · PDF</span>
          </button>
          <button
            type="button"
            className={`kindtab${mode === 'assignment' ? ' is-active' : ''}`}
            onClick={() => setMode('assignment')}
            aria-pressed={mode === 'assignment'}
          >
            과제<span>프롬프트 · 결과물</span>
          </button>
        </div>

        {mode === 'paper' ? (
          <AdminPapers />
        ) : mode === 'assignment' ? (
          <AdminAssignments />
        ) : (
          <>
        <form className="adminform" onSubmit={submit}>
          {editing && (
            <p className="adminbox__done">
              고치는 중입니다 — <b>{form.title || '(제목 없음)'}</b>
              <button className="btn-ghost" type="button" onClick={clearForm}>
                새 작품으로
              </button>
            </p>
          )}

          <label className="field">
            <span className="field__label">제목</span>
            <input
              className="field__input"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="작품 이름"
            />
          </label>

          <label className="field">
            <span className="field__label">
              설명 <i>선택</i>
            </span>
            <textarea
              className="field__input field__input--area"
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="어떤 작품인지 한두 문장"
            />
          </label>

          {/* 대표 작품 — Works 화면에서 항상 맨 앞에 크게 걸립니다 */}
          <label className="checkrow">
            <input
              type="checkbox"
              checked={form.pinned}
              onChange={(e) => setForm((f) => ({ ...f, pinned: e.target.checked }))}
            />
            <span>
              <b>항상 첫 번째로 보이기</b>
              <i>
                대표 작품 한 점만 지정할 수 있습니다. 나머지 작품은 방문할 때마다 두세 점씩
                무작위로 바뀝니다.
              </i>
            </span>
          </label>

          <MediaField
            kind="image"
            inputRef={imageRef}
            file={files.image}
            url={form.imageUrl}
            onPick={(file) => pickFile('image', file)}
            onClearUrl={() => setForm((f) => ({ ...f, imageUrl: '' }))}
            onTypeUrl={(v) => setForm((f) => ({ ...f, imageUrl: v }))}
          />

          <MediaField
            kind="video"
            inputRef={videoRef}
            file={files.video}
            url={form.videoUrl}
            onPick={(file) => pickFile('video', file)}
            onClearUrl={() => setForm((f) => ({ ...f, videoUrl: '' }))}
            onTypeUrl={(v) => setForm((f) => ({ ...f, videoUrl: v }))}
          />

          {error && (
            <p className="adminbox__error" role="alert">
              {error}
            </p>
          )}
          {done && !error && <p className="adminbox__done">{done}</p>}

          <div className="adminbox__actions">
            <button className="btn btn--sm" type="submit" disabled={Boolean(busy)}>
              {busy || (editing ? '수정 저장' : '등록하기')}
            </button>
            {(editing || form.title || form.imageUrl || form.videoUrl) && (
              <button className="btn-ghost" type="button" onClick={clearForm} disabled={Boolean(busy)}>
                입력 지우기
              </button>
            )}
          </div>
        </form>

        <section className="adminlist">
          <h3 className="adminlist__title">
            등록된 작품 <span>{items.length}</span>
          </h3>

          {status === 'loading' && <p className="adminlist__empty">불러오는 중입니다…</p>}
          {status === 'error' && <p className="adminbox__error">{listError}</p>}
          {status === 'ready' && items.length === 0 && (
            <p className="adminlist__empty">아직 등록된 작품이 없습니다.</p>
          )}

          {items.length > 0 && (
            <ul className="adminlist__rows">
              {items.map((item) => (
                <li className="adminrow" key={item.id}>
                  <div className="adminrow__thumb">
                    {item.image ? <img src={item.image} alt="" /> : <span className="adminrow__pdf">No Img</span>}
                  </div>

                  <div className="adminrow__meta">
                    <b>
                      {item.pinned && <span className="pinmark">첫 번째</span>}
                      {item.title}
                    </b>
                    <span>
                      {item.dateLabel}
                      {item.video ? ' · 영상 있음' : ''}
                    </span>
                    {item.description && <em>{item.description}</em>}
                  </div>

                  <div className="adminrow__actions">
                    <button className="btn-ghost" type="button" onClick={() => startEdit(item)}>
                      고치기
                    </button>
                    <button
                      className="btn-ghost btn-ghost--danger"
                      type="button"
                      onClick={() => remove(item)}
                    >
                      지우기
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
          </>
        )}

        <p className="adminbox__note">
          {mode === 'assignment' ? (
            <>
              프롬프트를 통째로 붙여넣어 두면, 나중에 무엇을 어떻게 물었는지 그대로
              돌아볼 수 있습니다. 사진과 첨부 파일은 Storage 의 <code>assignments/</code> 칸에
              올라갑니다.
            </>
          ) : mode === 'paper' ? (
            <>
              DOI 를 넣고 <b>정보 가져오기</b>를 누르면 제목·저자·학술지·연도·인용수·초록이
              공개 학술 데이터베이스에서 자동으로 채워집니다. AI 가 읽고 새로 쓰는 요약이
              아니라, 논문에 실린 원래 정보를 가져오는 것입니다. PDF 는 Storage 의{' '}
              <code>papers/</code> 칸에 올라갑니다.
            </>
          ) : (
            <>
              올린 파일은 Supabase Storage 의 <code>images/</code> · <code>videos/</code> 칸에
              들어가고, 파일 주소가 그 작품 줄에 자동으로 저장됩니다. 등록하면 방문자에게 바로
              보입니다. 저장에 실패하면 입력한 내용은 지우지 않으니 고친 뒤 다시 누르시면 됩니다.
            </>
          )}
        </p>
      </div>
    </div>
  )
}

/**
 * 사진 · 영상 한 칸.
 *
 * 넣는 방법이 두 가지입니다 —
 *   ① 파일을 골라 Storage 에 올리기
 *   ② 이미 인터넷에 있는 주소를 붙여넣기 (유튜브 링크, 다른 곳에 올린 파일 등)
 *
 * 용량 큰 영상은 ②가 낫습니다. 저장 공간도 안 쓰고 재생도 매끄럽습니다.
 */
function MediaField({ kind, inputRef, file, url, onPick, onClearUrl, onTypeUrl }) {
  const meta = MEDIA[kind]
  const id = `admin-file-${kind}`
  const linkHint =
    kind === 'video'
      ? '유튜브 · 비메오 주소를 붙여넣으면 그대로 재생됩니다'
      : '이미 인터넷에 있는 사진 주소를 붙여넣어도 됩니다'

  return (
    <div className="field">
      <span className="field__label">
        {meta.label} <i>선택 · {meta.hint}</i>
      </span>

      <div className="dropzone">
        <input
          ref={inputRef}
          id={id}
          className="dropzone__input"
          type="file"
          accept={meta.accept}
          onChange={(e) => onPick(e.target.files?.[0])}
        />
        <label className="dropzone__label" htmlFor={id}>
          {file ? (
            <>
              <b>{file.name}</b>
              <span>{formatSize(file.size)} · 저장을 누르면 올라갑니다</span>
            </>
          ) : (
            <>
              <b>{meta.label} 파일 고르기</b>
              <span>{url ? '새로 고르면 지금 것을 대신합니다' : meta.hint}</span>
            </>
          )}
        </label>
      </div>

      {/* ② 주소로 넣기 */}
      <div className="linkrow">
        <span className="linkrow__or">또는 주소 붙여넣기</span>
        <input
          className="field__input"
          type="url"
          value={url}
          onChange={(e) => onTypeUrl(e.target.value)}
          placeholder={kind === 'video' ? 'https://youtu.be/…' : 'https://…'}
        />
        <span className="linkrow__hint">{linkHint}</span>
      </div>

      {url && (
        <p className="mediaurl">
          <a href={url} target="_blank" rel="noopener noreferrer">
            지금 연결된 {meta.label} 열어 보기 →
          </a>
          <button className="btn-ghost" type="button" onClick={onClearUrl}>
            연결 끊기
          </button>
        </p>
      )}
    </div>
  )
}
