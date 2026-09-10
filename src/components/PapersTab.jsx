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
          각 카드의 한 줄 요약과 키워드로 주제를 먼저 파악할 수 있습니다. 카드를 누르면 초록과 기여
          내용을 볼 수 있습니다.
        </p>
      </div>

      <div className="panel__body">
        <div className="masonry masonry--2">
          {papers.map((p) => (
            <div className="masonry__item" key={p.id}>
              <button className="paper" onClick={() => onOpen(p)}>
                <div className="paper__top">
                  <span className="paper__index">{p.index}</span>
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
