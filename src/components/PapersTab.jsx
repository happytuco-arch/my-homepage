import { papers } from '../data/portfolio'

export default function PapersTab({ onOpen }) {
  return (
    <section className="wrap section panel">
      <div className="section__head">
        <div>
          <p className="kicker">Writing &amp; Research</p>
          <h2 className="section__title">Papers</h2>
        </div>
        <p className="section__note">
          아래 논문은 화면 구성을 보여 주기 위한 <b>예시 데이터</b>입니다. 실제 투고한 논문이
          아니며, 나중에 진짜 연구로 교체할 자리입니다.
        </p>
      </div>

      <div className="panel__body">
        <div className="masonry masonry--2">
          {papers.map((p) => (
            <div className="masonry__item" key={p.id}>
              <button className="paper" onClick={() => onOpen(p)}>
                <div className="paper__top">
                  <span className="paper__index">{p.index}</span>
                  <span className="badge-sample">Sample</span>
                  <span className="chip chip--key">{p.field}</span>
                  <span className="chip">{p.status}</span>
                </div>

                <h3 className="paper__title">{p.title}</h3>
                <p className="paper__title-en">{p.titleEn}</p>
                <p className="paper__summary">{p.summary}</p>

                <div className="paper__keys">
                  {p.keywords.map((k) => (
                    <span className="chip" key={k}>
                      #{k}
                    </span>
                  ))}
                </div>

                <div className="paper__foot">
                  <span>{p.venue}</span>
                  <i className="dot" />
                  <span>{p.year}</span>
                  <i className="dot" />
                  <span>Read →</span>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
