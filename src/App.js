import React, { Component } from 'react'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'

class App extends Component {
  state = {
    gists: null
  }
  componentDidMount = () => {
    fetch('https://api.github.com/gists')
      .then(res => res.json())
      .then(gists => {
        this.setState({ gists })
      })
  }
  
  render() {
    const { gists } = this.state
    return (
      <Router>
        <Root>
          <Link to="/">Index</Link>
          <Sidebar>
            {gists ? (
              gists.map(gist => (
                <SidebarItem key={gist.id}>
                  <Link to={`/g/${gist.id}`}>
                  {gist.description || '[no description]'}
                  </Link>
                </SidebarItem>
              ))
            ) : (
              <div>Loading...</div>
            )}
          </Sidebar>
          <Main>
            <Route exact={true} path="/" render={() => (
              <h1>Welcome</h1>
            )}/>
            {gists && (
              <Route path="/g/:gistId" render={({match}) => (
                <Gist gist={gists.find(g => g.id === match.params.gistId )}/>
              )} />
            )}
          </Main>
        </Root>
      </Router>
    );
  }
  
}


const Gist = ({ gist }) => {
  console.log(gist)
  return (
    <div>
      <h1>{gist.description}</h1>
      <ul>
        {Object.keys(gist.files).map(key => (
          <li key={gist.id}>
            <b>{key}</b>
            <LoadFile url={gist.files[key].raw_url}>
              {(text) => (
                <pre>{text}</pre>
              )}
            </LoadFile>
          </li>
        ))}
      </ul>    
    </div>
  )
}

class LoadFile extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       content: null
    }
  }
  componentDidMount = () => {
    fetch(this.props.url)
      .then(res => res.text())
      .then(res => {
        this.setState({
          content: res
        })
      })
  }
  
  render() {
    const {content} = this.state
    return (
      <pre>
        <div dangerouslySetInnerHTML={{__html: content}} />
      </pre>
    )
  }
}



const Root = (props) => (
  <div style={{
    display: 'flex'
  }} {...props} ></div>
)

const Sidebar = (props) => (
  <div style={{
    width: '33vw',
    height: '100vh',
    overflow: 'auto',
    background: '#eee'
  }} {...props} ></div>
)

const SidebarItem = (props) => (
  <div style={{
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    padding: '5px 10px'
  }} {...props}></div>

)


const Main = (props) => (
  <div style={{
    flex: 1,
    height: '100vh',
    overflow: 'auto'
  }} >
    <div style={{ padding: '20px' }} {...props}></div>
  </div>
)


export default App;
