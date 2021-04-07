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
      `${proxy}${options.host}api/json?tree=jobs[lastBuild[displayName,number,building,result,estimatedDuration,duration,url]]`
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
  right: 0px;
  bottom: 0px;
  font-family: Helvetica Neue;
  z-index: 1;
  padding: 20px;
  font-size: 12px;
  font-weight: 300;
  color: rgba(255,255,255,.9);
  text-shadow: 0 1px 1px rgba(0,0,0,0.7);
`

const itemContainer = css`
  position: relative;
  display: flex;
  flex-flow: column;
  flex-direction: column-reverse;
  border-radius: 3px;
  margin: 5px 0px;
  padding: 5px 0px 0px 0px;
  background: rgba(255, 255, 255, 0.2);
  width: 100%;
  height: 50px;
`

const status = css`
  position: absolute;
  right: 3px;
  top: 0px;
  font-size: 20px;
`

const building = css`
  color: #cd853f;
`

const success = css`
  color: #3cb371;
`

const failure = css`
  color: #cd5c5c;
`

const titleLink = css`
  margin-bottom: 3px;
  margin-left: 3px;
  color: #ffffff;
  text-decoration: none;
`

const searchInput = css`
  width: 246px;
  border: 1px solid #aaa;
  background: rgba(255, 255, 255, 0.3);
  color: #fff;
`

const StatusBuilding = () => (
  <div className={status}>
    <span className={building}>Building</span>
  </div>
)
const StatusFailure = () => (
  <div className={status}>
    <span className={failure}>Failure</span>
  </div>
)
const StatusSuccess = () => (
  <div className={status}>
    <span className={success}>Success</span>
  </div>
)

const Status = ({ pr }) => {
  if (pr.building) return <StatusBuilding />
  if (pr.result === "FAILURE") return <StatusFailure />
  if (pr.result === "SUCCESS") return <StatusSuccess />
  return null
}

const WidgetTitle = () => <span>Jenkins build tracker</span>

const Title = ({ pr }) => (
  <a className={titleLink} href={pr.url}>
    {pr.displayName}
  </a>
)

const Progress = ({ current, estimate }) => {
  let styles = {
    borderRadius: "0px 3px 3px 3px",
    background: "#ddd",
    height: "100%",
    width: `${(current / estimate) * 100}%`,
  }
  return (
    <div
      style={{
        width: "100%",
        background: "#777",
        height: "3px",
        borderRadius: "0px 0px 3px 3px",
      }}
    >
      <div style={styles}></div>
    </div>
  )
}

let searchTerm = ""

export const render = ({ data }, dispatch) => {
  return (
    <div>
      <div>
        <WidgetTitle />
        {data.map((pr, key) => (
          <div id={key} className={itemContainer}>
            <Status pr={pr} />
            <Progress current={pr.duration} estimate={pr.estimatedDuration} />
            <Title pr={pr} />
          </div>
        ))}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            dispatch({ type: "UPDATE_FILTER", searchRegex: searchTerm })
          }}
        >
          <input
            type="text"
            name="search"
            className={searchInput}
            onChange={(e) => (searchTerm = e.target.value)}
          />
          <input type="submit" hidden={true} />
        </form>
      </div>
    </div>
  )
}
