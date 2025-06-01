// components/ui/Avatar.js
export const Avatar = ({ className = "", children }) => (
  <div className={`rounded-full overflow-hidden ${className}`}>
    {children}
  </div>
);

export const AvatarImage = ({ src, alt, className = "" }) => (
  <img 
    src={'https://avatar.iran.liara.run/public/39'} 
    alt={'user'} 
    className={`w-full h-full object-cover ${className}`} 
  />
);