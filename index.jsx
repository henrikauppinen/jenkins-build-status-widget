import { css } from "uebersicht"
export { updateState } from "./src/updateState"

const options = {
  host: "",
  auth: "", // BASE64 user:pass
}

export const refreshFrequency = 10 * 60 * 1000

export const initialState = {
  data: [],
  jobs: [],
  searchRegex: "?!",
}

const proxy = "http://127.0.0.1:41417/"

const api = async () =>
  await fetch(
    new URL(
      `${proxy}${options.host}api/json?tree=jobs[lastBuild[displayName,building,result,url]]`
    ),
    {
      headers: {
        Authorization: "Basic " + options.auth,
      },
    }
  )

export const command = async (dispatch) => {
  const response = await api()
  const { jobs } = await response.json()
  dispatch({ type: "UPDATE_JOBS", jobs: jobs })
}

export const className = `
  width: 250px;
  left: 20px;
  bottom: 20px;
  background: rgba(0, 0, 0, 0.2);
  -webkit-backdrop-filter: blur(5px);
  border-radius: 10px;
  font-family: -apple-system, BlinkMacSystemFont;
  z-index: 1;
  padding: 20px;
  font-size: 12px;
  line-heigth: 1.2;
  color: #fffd;
`

const widgetTitle = css`
  margin: 0 0 18px;
  font-size: 14px;
`

const itemContainer = css`
  max-height: 80vh;
  overflow-x: hidden;
  overflow-y: auto;
  margin-bottom: 15px;
`

const item = css`
  display: flex;
  & + & {
    margin-top: 15px;
  }
`

const status = css`
  flex: 0 0 12px;
  display: inline-block;
  height: 12px;
  border-radius: 20px;
  margin-top: 1px;
`

const building = css`
  background: #FFBD2D;
  animation-name: building;
  animation-duration: 3s;
  animation-iteration-count: infinite;

  @keyframes building {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
`

const success = css`
  background: #2BCA41;
`

const failure = css`
  background: #FF544D;
`

const titleLink = css`
  margin: 0 0 0 10px;
  color: #fff;
  text-decoration: none;
  vertical-align: top;
`

const searchInput = css`
  box-sizing: border-box;
  width: 100%;
  font-size: 12px;
  padding: 5px 10px 6px;
  border-radius: 5px;
  border: 0;
  box-shadow: inset 0 1px 0 #fff1, 0 1px 1px #0005;
  background: #fff1;
  color: #fff;
  &:focus {
    outline: 0;
  }
`

const Status = ({ pr }) => {
  const statusClass = 
    pr.building 
      ? building 
      : pr.result === 'SUCCESS' ? success : failure
  
  return (<span className={`${status} ${statusClass}`} />)
}

export const render = ({ data }, dispatch) => {
  const updateSearchQuery = (e) => {
    dispatch({ type: "UPDATE_FILTER", searchRegex: RegExp(e.target.value || "!!", 'i') })
  }

  return (
    <div>
      <h1 className={widgetTitle}>Jenkins build tracker</h1>
      <div className={itemContainer}>
        {data.map((pr, key) => (
          <div key={key} className={item}>
            <Status pr={pr} />
            <a className={titleLink} href={pr.url}>
              {pr.displayName}
            </a>
          </div>
        ))}
      </div>
      <input
        type="text"
        name="search"
        className={searchInput}
        onChange={updateSearchQuery}
        autoComplete="false"
        placeholder="Filter by branch name"
      />
    </div>
  )
}
