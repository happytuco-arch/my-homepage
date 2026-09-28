import { useRef, useState } from 'react'
import {
  createAssignment,
  deleteAssignment,
  updateAssignment,
  uploadAssignmentFile,
} from '../admin/assignmentsApi'
import { useAssignments } from '../lib/useAssignments'

const EMPTY = {
  id: null,
  title: '',
  course: '',
  week: '',
  prompt: '',
  note: '',
  resultUrl: '',
  imageUrl: '',
  fileUrl: '',
}

/**
 * 과제 제출물 등록 화면.
 *
 * 프롬프트를 통째로 붙여넣는 것이 중심이라 입력칸을 크게 두었습니다.
 * 저장에 실패해도 입력한 내용은 지우지 않습니다.
 */
export default function AdminAssignments() {
  const { items, status, error: listError, reload } = useAssignments()

  const [form, setForm] = useState(EMPTY)
  const [files, setFiles] = useState({ image: null, file: null })
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState('')
  const imageRef = useRef(null)
  const fileRef = useRef(null)

  const editing = Boolean(form.id)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const clearForm = () => {
    setForm(EMPTY)
    setFiles({ image: null, file: null })
    if (imageRef.current) imageRef.current.value = ''
    if (fileRef.current) fileRef.current.value = ''
  }

  const startEdit = (a) => {
    const r = a.raw
    setForm({
      id: r.id,
      title: r.title || '',
      course: r.course || '',
      week: r.week || '',
      prompt: r.prompt || '',
      note: r.note || '',
      resultUrl: r.result_url || '',
      imageUrl: r.image_url || '',
      fileUrl: r.file_url || '',
    })
    setFiles({ image: null, file: null })
    setError('')
    setDone('')
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('과제 이름을 입력해 주세요.')
      return
    }
    setError('')
    setDone('')

    let next = { ...form }

    try {
      // 올린 결과가 폼에 남아, 중간에 실패해도 다시 올리지 않습니다
      if (files.image) {
        setBusy('사진 올리는 중…')
        const { url } = await uploadAssignmentFile(files.image)
        next = { ...next, imageUrl: url }
        setForm(next)
        setFiles((f) => ({ ...f, image: null }))
        if (imageRef.current) imageRef.current.value = ''
      }

      if (files.file) {
        setBusy('첨부 파일 올리는 중…')
        const { url } = await uploadAssignmentFile(files.file)
        next = { ...next, fileUrl: url }
        setForm(next)
        setFiles((f) => ({ ...f, file: null }))
        if (fileRef.current) fileRef.current.value = ''
      }

      setBusy(editing ? '수정하는 중…' : '등록하는 중…')
      if (editing) await updateAssignment(next.id, next)
      else await createAssignment(next)

      setDone(editing ? '수정했습니다.' : '등록했습니다.')
      clearForm()
      await reload()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy('')
    }
  }

  const remove = async (a) => {
    if (!window.confirm(`"${a.title}" 을(를) 지울까요? 되돌릴 수 없습니다.`)) return
    setError('')
    setDone('')
    try {
      setBusy('지우는 중…')
      await deleteAssignment(a.id)
      if (form.id === a.id) clearForm()
      setDone('지웠습니다.')
      await reload()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy('')
    }
  }

  return (
    <>
      <form className="adminform" onSubmit={submit}>
        {editing && (
          <p className="adminbox__done">
            고치는 중입니다 — <b>{form.title || '(제목 없음)'}</b>
            <button className="btn-ghost" type="button" onClick={clearForm}>
              새 과제로
            </button>
          </p>
        )}

        <label className="field">
          <span className="field__label">과제 이름</span>
          <input className="field__input" value={form.title} onChange={set('title')} />
        </label>

        <div className="field3">
          <label className="field">
            <span className="field__label">
              수업 <i>선택</i>
            </span>
            <input
              className="field__input"
              value={form.course}
              onChange={set('course')}
              placeholder="AI기반 콘텐츠 창업 워크숍"
            />
          </label>
          <label className="field">
            <span className="field__label">
              주차 <i>선택</i>
            </span>
            <input
              className="field__input"
              value={form.week}
              onChange={set('week')}
              placeholder="Week 3"
            />
          </label>
          <label className="field">
            <span className="field__label">
              결과물 주소 <i>선택</i>
            </span>
            <input
              className="field__input"
              type="url"
              value={form.resultUrl}
              onChange={set('resultUrl')}
              placeholder="https://…"
            />
          </label>
        </div>

        {/* 이 화면의 핵심 */}
        <label className="field">
          <span className="field__label">
            프롬프트 <i>AI 에게 준 글을 그대로 붙여넣으세요</i>
          </span>
          <textarea
            className="field__input field__input--area field__input--prompt"
            rows={10}
            value={form.prompt}
            onChange={set('prompt')}
            placeholder="관리자 로그인 버튼과, 사진·영상·논문 파일 업로드 버튼을 만들어줘…"
          />
        </label>

        <label className="field">
          <span className="field__label">
            메모 <i>선택 · 무엇을 의도했고 무엇이 나왔는지</i>
          </span>
          <textarea
            className="field__input field__input--area"
            rows={3}
            value={form.note}
            onChange={set('note')}
          />
        </label>

        <FilePick
          id="asg-image"
          label="결과 화면 사진"
          hint="JPG · PNG"
          accept="image/*"
          inputRef={imageRef}
          file={files.image}
          url={form.imageUrl}
          onPick={(f) => {
            setError('')
            setDone('')
            setFiles((s) => ({ ...s, image: f ?? null }))
          }}
          onClear={() => setForm((f) => ({ ...f, imageUrl: '' }))}
        />

        <FilePick
          id="asg-file"
          label="첨부 파일"
          hint="PDF · ZIP 등"
          accept=".pdf,.zip,.txt,.md,application/pdf"
          inputRef={fileRef}
          file={files.file}
          url={form.fileUrl}
          onPick={(f) => {
            setError('')
            setDone('')
            setFiles((s) => ({ ...s, file: f ?? null }))
          }}
          onClear={() => setForm((f) => ({ ...f, fileUrl: '' }))}
        />

        {error && (
          <p className="adminbox__error" role="alert">
            {error}
          </p>
        )}
        {done && !error && <p className="adminbox__done">{done}</p>}

        <div className="adminbox__actions">
          <button className="btn btn--sm" type="submit" disabled={Boolean(busy)}>
            {busy || (editing ? '수정 저장' : '과제 등록')}
          </button>
          {(editing || form.title) && (
            <button className="btn-ghost" type="button" onClick={clearForm} disabled={Boolean(busy)}>
              입력 지우기
            </button>
          )}
        </div>
      </form>

      <section className="adminlist">
        <h3 className="adminlist__title">
          등록된 과제 <span>{items.length}</span>
        </h3>

        {status === 'loading' && <p className="adminlist__empty">불러오는 중입니다…</p>}
        {status === 'error' && <p className="adminbox__error">{listError}</p>}
        {status === 'ready' && items.length === 0 && (
          <p className="adminlist__empty">아직 등록된 과제가 없습니다.</p>
        )}

        {items.length > 0 && (
          <ul className="adminlist__rows">
            {items.map((a) => (
              <li className="adminrow" key={a.id}>
                <div className="adminrow__thumb">
                  {a.image ? <img src={a.image} alt="" /> : <span className="adminrow__pdf">TXT</span>}
                </div>
                <div className="adminrow__meta">
                  <b>{a.title}</b>
                  <span>{[a.week, a.course, a.dateLabel].filter(Boolean).join(' · ')}</span>
                  {a.prompt && <em>{a.prompt.slice(0, 70)}…</em>}
                </div>
                <div className="adminrow__actions">
                  <button className="btn-ghost" type="button" onClick={() => startEdit(a)}>
                    고치기
                  </button>
                  <button
                    className="btn-ghost btn-ghost--danger"
                    type="button"
                    onClick={() => remove(a)}
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
  )
}

/** 파일 한 칸 */
function FilePick({ id, label, hint, accept, inputRef, file, url, onPick, onClear }) {
  return (
    <div className="field">
      <span className="field__label">
        {label} <i>선택 · {hint}</i>
      </span>

      <div className="dropzone">
        <input
          ref={inputRef}
          id={id}
          className="dropzone__input"
          type="file"
          accept={accept}
          onChange={(e) => onPick(e.target.files?.[0])}
        />
        <label className="dropzone__label" htmlFor={id}>
          {file ? (
            <>
              <b>{file.name}</b>
              <span>{(file.size / 1024).toFixed(0)} KB · 저장을 누르면 올라갑니다</span>
            </>
          ) : (
            <>
              <b>{label} 고르기</b>
              <span>{url ? '새로 고르면 지금 것을 대신합니다' : hint}</span>
            </>
          )}
        </label>
      </div>

      {url && (
        <p className="mediaurl">
          <a href={url} target="_blank" rel="noopener noreferrer">
            지금 연결된 {label} 열어 보기 →
          </a>
          <button className="btn-ghost" type="button" onClick={onClear}>
            연결 끊기
          </button>
        </p>
      )}
    </div>
  )
}
