import Link from 'next/link'
import Image from 'next/image'

const Navbar = () => {
  return (
    <nav>
      <div className="logo">
        <Image src="/logo.png" alt="site logo" width={128} height={77} />
      </div>
      <a className='link'>Home</a>
      <a className='link'>About</a>
      <a className='link'>Listing</a>
    </nav>
  );
}

export default Navbar;