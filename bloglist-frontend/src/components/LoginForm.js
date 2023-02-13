const LoginForm = ({ username, password, handleSubmit, setUsername, setPassword }) => {
  return(
    <div>
      <h2>Log In to Bloglist Application</h2>
      <form onSubmit={handleSubmit}>
        <p>
          Username: <input type='text' name='username' value={username}
            id='username' onChange={({ target }) => setUsername(target.value)} />
        </p>
        <p>
          Password: <input type='password' name='password' value={password}
            id='password' onChange={({ target }) => setPassword(target.value)} />
        </p>
        <button type='submit' id='log_in_button'>Log In</button>
      </form>
    </div>
  )
}

export default LoginForm