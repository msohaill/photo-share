import logo from '../../assets/images/thousandwords.png';
import './style.scss';

const Header = () => {
  return (
    <header>
      <img id='header-logo' src={logo} />
    </header>
  );
};

export default Header;
