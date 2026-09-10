import { gallery } from '../data/portfolio'
import SmartImage from './SmartImage'

export default function ImagesTab() {
  return (
    <section className="wrap section panel">
      <div className="section__head">
        <div>
          <p className="kicker">Process Archive</p>
          <h2 className="section__title">Images</h2>
        </div>
        <p className="section__note">
          모두 화면 구성을 보여 주기 위한 <b>예시 이미지</b>입니다. 실제 작업물이 아니며,
          나중에 진짜 기록으로 교체할 자리입니다.
        </p>
      </div>

      <div className="panel__body">
        <div className="masonry">
          {gallery.map((g) => (
            <figure className="masonry__item" key={g.id}>
              <div className={`mcard__figure ratio-${g.ratio}`}>
                <span className="card__index">{g.index}</span>
                <span className="card__badges">
                  <span className="badge-sample">Sample</span>
                </span>
                <SmartImage className="card__img" src={g.image} alt={g.title} />
              </div>
              <figcaption className="mcard__caption">
                <h3 className="mcard__title">{g.title}</h3>
                <p className="mcard__text">{g.caption}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
