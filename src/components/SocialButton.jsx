export default function SocialButton({ href, icon: Icon, label, color }) {
  return (
    <a href={href} target={href.startsWith('mailto') ? '_self' : '_blank'} rel="noopener noreferrer" title={label}
      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${color}`}>
      <Icon size={20}/>
    </a>
  )
}
