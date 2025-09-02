import { Heart, MapPin, GraduationCap, Briefcase, Star, X, Check } from 'lucide-react'

interface MatchCardProps {
  match: {
    id: string
    name: string
    age: number
    location: string
    education: string
    profession: string
    bio: string
    interests: string[]
    compatibilityScore: number
    photos: string[]
  }
  onLike?: (matchId: string) => void
  onPass?: (matchId: string) => void
}

export default function MatchCard({ match, onLike, onPass }: MatchCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-sm mx-auto">
      {/* Photo */}
      <div className="relative h-80 bg-gray-200">
        {match.photos?.[0] ? (
          <img
            src={match.photos[0]}
            alt={match.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-gold-100">
            <Heart className="h-16 w-16 text-primary-400" />
          </div>
        )}
        
        {/* Compatibility Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
          <Star className="h-4 w-4 text-gold-500 mr-1" />
          <span className="text-sm font-semibold text-gray-900">
            {match.compatibilityScore}% match
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {match.name}, {match.age}
          </h3>
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="h-4 w-4 mr-1" />
            {match.location}
          </div>
        </div>

        {/* Education & Profession */}
        <div className="space-y-2 mb-4">
          <div className="flex items-start">
            <GraduationCap className="h-4 w-4 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-700">{match.education}</span>
          </div>
          <div className="flex items-start">
            <Briefcase className="h-4 w-4 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-700">{match.profession}</span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
          {match.bio}
        </p>

        {/* Interests */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {match.interests.slice(0, 3).map((interest, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium"
              >
                {interest}
              </span>
            ))}
            {match.interests.length > 3 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                +{match.interests.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => onPass?.(match.id)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center"
          >
            <X className="h-5 w-5 mr-2" />
            Pass
          </button>
          <button
            onClick={() => onLike?.(match.id)}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
          >
            <Heart className="h-5 w-5 mr-2" />
            Interested
          </button>
        </div>
      </div>
    </div>
  )
}
