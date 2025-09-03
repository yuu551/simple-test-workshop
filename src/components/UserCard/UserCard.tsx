import './UserCard.css'

interface UserCardProps {
  name: string
  email: string
  age?: number
  role?: string
  avatarUrl?: string
  isOnline?: boolean
}

export const UserCard = ({ 
  name, 
  email, 
  age, 
  role, 
  avatarUrl, 
  isOnline = false 
}: UserCardProps) => {
  return (
    <div className="user-card">
      <div className="user-card__header">
        <div className="user-card__avatar">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={`${name}のアバター`}
              className="user-card__avatar-img"
            />
          ) : (
            <div className="user-card__avatar-placeholder" data-testid="avatar-placeholder">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          {isOnline && (
            <div 
              className="user-card__status user-card__status--online"
              data-testid="online-indicator"
              aria-label="オンライン"
            />
          )}
        </div>
        
        <div className="user-card__info">
          <h3 className="user-card__name" data-testid="user-name">
            {name}
          </h3>
          {role && (
            <p className="user-card__role" data-testid="user-role">
              {role}
            </p>
          )}
        </div>
      </div>

      <div className="user-card__details">
        <div className="user-card__detail">
          <span className="user-card__label">メール:</span>
          <span className="user-card__value" data-testid="user-email">
            {email}
          </span>
        </div>
        
        {age !== undefined && (
          <div className="user-card__detail">
            <span className="user-card__label">年齢:</span>
            <span className="user-card__value" data-testid="user-age">
              {age}歳
            </span>
          </div>
        )}
      </div>
    </div>
  )
}