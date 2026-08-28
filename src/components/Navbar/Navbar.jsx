import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserData } from '../context/UserData';

export default function Navbar() {

  let navigate = useNavigate();

  let { token, settoken, data } = useContext(UserData);

  function signOut() {
    localStorage.removeItem("userToken");
    settoken(null);
    navigate("/login");
  }

  return <>
    <div className="navbar shadow-sm px-16 bg-gray-300">
      <div className="flex-1">
        {token ? <>
          <Link to="home" className="btn btn-ghost text-xl">Home</Link>
          <Link to="profile" className="btn btn-ghost text-xl">Profile</Link>
        </> :
          <h1>Socail App</h1>}

      </div>
      <div className="flex gap-2">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src={data?.photo} />
            </div>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
            {token ? <li><span onClick={() => signOut()}>Logout</span></li> :
              <>
                <li><Link to="register">Register</Link></li>
                <li><Link to="login">Login</Link></li>
              </>}
          </ul>
        </div>
      </div>
    </div>
  </>
}
