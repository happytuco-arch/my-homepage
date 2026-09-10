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
          타일셋, 스프라이트 시트, UI 실험 등 작업 중에 남긴 이미지 기록입니다.
        </p>
      </div>

      <div className="panel__body">
        <div className="masonry">
          {gallery.map((g) => (
            <figure className="masonry__item" key={g.id}>
              <div className={`mcard__figure ratio-${g.ratio}`}>
                <span className="card__index">{g.index}</span>
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
