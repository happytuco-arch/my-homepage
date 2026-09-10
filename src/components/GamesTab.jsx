import { games } from '../data/portfolio'
import SmartImage from './SmartImage'

function GameCard({ item, size, onOpen }) {
  return (
    <button className={`card card--${size}`} onClick={() => onOpen(item)}>
      <div className="card__figure">
        <span className="card__index">{item.index}</span>
        <span className="card__status">{item.status}</span>
        <SmartImage className="card__img" src={item.image} alt={item.title} />
        <span className="card__view">
          <span>View Project</span>
          <span>→</span>
        </span>
      </div>

      <div className="card__body">
        <p className="kicker">
          {item.year} · {item.role}
        </p>
        <h3 className="card__title">{item.title}</h3>
        <p className="card__sub">{item.subtitle}</p>
        {size === 'lg' && <p className="card__tagline">“{item.tagline}”</p>}
      </div>
    </button>
  )
}

export default function GamesTab({ onOpen }) {
  const [lead, ...rest] = games

  return (
    <section className="wrap section panel">
      <div className="section__head">
        <div>
          <p className="kicker">Selected Works</p>
          <h2 className="section__title">Games</h2>
        </div>
        <p className="section__note">
          기획부터 도트 리소스, 밸런싱까지 직접 만든 프로젝트입니다. 카드를 누르면 제작 과정과
          의사결정 기록을 볼 수 있습니다.
        </p>
      </div>

      <div className="panel__body">
        <div className="feature">
          <GameCard item={lead} size="lg" onOpen={onOpen} />
          {rest.map((g) => (
            <GameCard key={g.id} item={g} size="sm" onOpen={onOpen} />
          ))}
        </div>
      </div>
    </section>
  )
}
