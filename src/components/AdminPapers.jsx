import { useRef, useState } from 'react'
import { createPaper, deletePaper, updatePaper, uploadPdf } from '../admin/papersApi'
import { lookupByDoi } from '../lib/paperLookup'
import { usePapers } from '../lib/usePapers'

const EMPTY = {
  id: null,
  title: '',
  authors: '',
  venue: '',
  year: '',
  citations: '',
  doi: '',
  link: '',
  pdfUrl: '',
  summary: '',
  abstract: '',
  takeaways: '',
  keywords: '',
}

/**
 * 논문 등록 화면.
 *
 * DOI 를 넣고 '정보 가져오기'를 누르면 제목·저자·학술지·연도·인용수·초록이
 * 공개 학술 데이터베이스에서 자동으로 채워집니다. 그대로 두거나 고쳐서 저장합니다.
 *
 * 저장에 실패해도 입력한 내용은 지우지 않습니다.
 */
export default function AdminPapers() {
  const { items, status, error: listError, reload } = usePapers()

  const [form, setForm] = useState(EMPTY)
  const [doiInput, setDoiInput] = useState('')
  const [pdf, setPdf] = useState(null)
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState('')
  const pdfRef = useRef(null)

  const editing = Boolean(form.id)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const clearForm = () => {
    setForm(EMPTY)
    setDoiInput('')
    setPdf(null)
    if (pdfRef.current) pdfRef.current.value = ''
  }

  const startEdit = (p) => {
    const r = p.raw
    setForm({
      id: r.id,
      title: r.title || '',
      authors: r.authors || '',
      venue: r.venue || '',
      year: r.year || '',
      citations: r.citations ?? '',
      doi: r.doi || '',
      link: r.link || '',
      pdfUrl: r.pdf_url || '',
      summary: r.summary || '',
      abstract: r.abstract || '',
      takeaways: r.takeaways || '',
      keywords: r.keywords || '',
    })
    setDoiInput(r.doi || '')
    setPdf(null)
    setError('')
    setDone('')
  }

  /** DOI 로 서지 정보를 받아 빈 칸을 채웁니다 (이미 적어 둔 값은 건드리지 않습니다) */
  const fetchInfo = async () => {
    setError('')
    setDone('')
    setBusy('논문 정보 찾는 중…')
    try {
      const got = await lookupByDoi(doiInput)
      setForm((f) => ({
        ...f,
        title: f.title || got.title,
        authors: f.authors || got.authors,
        venue: f.venue || got.venue,
        year: f.year || got.year,
        citations: f.citations === '' && got.citations != null ? String(got.citations) : f.citations,
        abstract: f.abstract || got.abstract,
        doi: got.doi,
        link: f.link || got.link,
      }))
      setDone(`${got.source} 에서 정보를 가져왔습니다. 확인하고 고쳐 주세요.`)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy('')
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('제목을 입력해 주세요.')
      return
    }
    setError('')
    setDone('')

    let next = { ...form }

    try {
      if (pdf) {
        setBusy('PDF 올리는 중…')
        const { url } = await uploadPdf(pdf)
        next = { ...next, pdfUrl: url }
        setForm(next)
        setPdf(null)
        if (pdfRef.current) pdfRef.current.value = ''
      }

      setBusy(editing ? '수정하는 중…' : '등록하는 중…')
      if (editing) await updatePaper(next.id, next)
      else await createPaper(next)

      setDone(editing ? '수정했습니다.' : '등록했습니다.')
      clearForm()
      await reload()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy('')
    }
  }

  const remove = async (p) => {
    if (!window.confirm(`"${p.title}" 을(를) 지울까요? 되돌릴 수 없습니다.`)) return
    setError('')
    setDone('')
    try {
      setBusy('지우는 중…')
      await deletePaper(p.id)
      if (form.id === p.id) clearForm()
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
              새 논문으로
            </button>
          </p>
        )}

        {/* DOI 한 줄이면 나머지가 채워집니다 */}
        <div className="field">
          <span className="field__label">
            DOI 또는 논문 주소 <i>여기부터 시작하세요</i>
          </span>
          <div className="doirow">
            <input
              className="field__input"
              value={doiInput}
              onChange={(e) => setDoiInput(e.target.value)}
              placeholder="10.1109/TG.2024.3461510"
            />
            <button
              className="btn-ghost"
              type="button"
              onClick={fetchInfo}
              disabled={!doiInput.trim() || Boolean(busy)}
            >
              정보 가져오기
            </button>
          </div>
          <span className="linkrow__hint">
            제목·저자·학술지·연도·인용수·초록을 공개 학술 데이터베이스(OpenAlex · Crossref)에서
            받아 옵니다. 이미 적어 둔 칸은 덮어쓰지 않습니다.
          </span>
        </div>

        <label className="field">
          <span className="field__label">제목</span>
          <input className="field__input" value={form.title} onChange={set('title')} />
        </label>

        <label className="field">
          <span className="field__label">저자</span>
          <input
            className="field__input"
            value={form.authors}
            onChange={set('authors')}
            placeholder="R. Gallotta, G. Todd, …"
          />
        </label>

        <div className="field3">
          <label className="field">
            <span className="field__label">학술지 · 학회</span>
            <input className="field__input" value={form.venue} onChange={set('venue')} />
          </label>
          <label className="field">
            <span className="field__label">연도</span>
            <input className="field__input" value={form.year} onChange={set('year')} />
          </label>
          <label className="field">
            <span className="field__label">인용수</span>
            <input
              className="field__input"
              type="number"
              min="0"
              value={form.citations}
              onChange={set('citations')}
            />
          </label>
        </div>

        <label className="field">
          <span className="field__label">
            한 줄 설명 <i>카드에 보입니다</i>
          </span>
          <textarea
            className="field__input field__input--area"
            rows={2}
            value={form.summary}
            onChange={set('summary')}
            placeholder="이 논문이 무엇을 밝혔는지 한두 문장으로"
          />
        </label>

        <label className="field">
          <span className="field__label">
            초록 <i>자동으로 채워집니다</i>
          </span>
          <textarea
            className="field__input field__input--area"
            rows={4}
            value={form.abstract}
            onChange={set('abstract')}
          />
        </label>

        <label className="field">
          <span className="field__label">
            받아들인 관점 <i>한 줄에 하나씩</i>
          </span>
          <textarea
            className="field__input field__input--area"
            rows={3}
            value={form.takeaways}
            onChange={set('takeaways')}
            placeholder={'레벨은 글이 아니라 규칙이다\n데이터를 먼저 늘리는 쪽이 효과가 크다'}
          />
        </label>

        <label className="field">
          <span className="field__label">
            키워드 <i>쉼표로 구분</i>
          </span>
          <input
            className="field__input"
            value={form.keywords}
            onChange={set('keywords')}
            placeholder="절차적 생성, 소코반, 데이터셋 규모"
          />
        </label>

        <label className="field">
          <span className="field__label">
            원문 주소 <i>선택</i>
          </span>
          <input
            className="field__input"
            type="url"
            value={form.link}
            onChange={set('link')}
            placeholder="https://doi.org/…"
          />
        </label>

        {/* PDF */}
        <div className="field">
          <span className="field__label">
            PDF 파일 <i>선택</i>
          </span>
          <div className="dropzone">
            <input
              ref={pdfRef}
              id="admin-paper-pdf"
              className="dropzone__input"
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) => {
                setError('')
                setDone('')
                setPdf(e.target.files?.[0] ?? null)
              }}
            />
            <label className="dropzone__label" htmlFor="admin-paper-pdf">
              {pdf ? (
                <>
                  <b>{pdf.name}</b>
                  <span>{(pdf.size / 1024 / 1024).toFixed(1)} MB · 저장을 누르면 올라갑니다</span>
                </>
              ) : (
                <>
                  <b>PDF 고르기</b>
                  <span>{form.pdfUrl ? '새로 고르면 지금 것을 대신합니다' : 'PDF'}</span>
                </>
              )}
            </label>
          </div>

          {form.pdfUrl && (
            <p className="mediaurl">
              <a href={form.pdfUrl} target="_blank" rel="noopener noreferrer">
                올라가 있는 PDF 열어 보기 →
              </a>
              <button
                className="btn-ghost"
                type="button"
                onClick={() => setForm((f) => ({ ...f, pdfUrl: '' }))}
              >
                연결 끊기
              </button>
            </p>
          )}
        </div>

        {error && (
          <p className="adminbox__error" role="alert">
            {error}
          </p>
        )}
        {done && !error && <p className="adminbox__done">{done}</p>}

        <div className="adminbox__actions">
          <button className="btn btn--sm" type="submit" disabled={Boolean(busy)}>
            {busy || (editing ? '수정 저장' : '논문 등록')}
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
          등록된 논문 <span>{items.length}</span>
        </h3>

        {status === 'loading' && <p className="adminlist__empty">불러오는 중입니다…</p>}
        {status === 'error' && <p className="adminbox__error">{listError}</p>}
        {status === 'ready' && items.length === 0 && (
          <p className="adminlist__empty">아직 등록된 논문이 없습니다.</p>
        )}

        {items.length > 0 && (
          <ul className="adminlist__rows">
            {items.map((p) => (
              <li className="adminrow" key={p.id}>
                <div className="adminrow__thumb">
                  <span className="adminrow__pdf">{p.pdf ? 'PDF' : 'DOI'}</span>
                </div>
                <div className="adminrow__meta">
                  <b>{p.title}</b>
                  <span>
                    {[p.venue, p.year, p.citations != null ? `인용 ${p.citations}` : null]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                  {p.summary && <em>{p.summary}</em>}
                </div>
                <div className="adminrow__actions">
                  <button className="btn-ghost" type="button" onClick={() => startEdit(p)}>
                    고치기
                  </button>
                  <button
                    className="btn-ghost btn-ghost--danger"
                    type="button"
                    onClick={() => remove(p)}
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
