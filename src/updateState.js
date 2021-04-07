export const updateState = (event, previousState) => {
  switch (event.type) {
    case "FETCH_SUCCEEDED":
      const dataa = filterJobs(previousState.jobs, previousState.searchRegex);
      return { ...previousState, jobs: event.jobs, data: dataa };
    case "UPDATE_FILTER":
      const data = filterJobs(previousState.jobs, event.searchRegex);
      return { ...previousState, data, searchRegex: event.searchRegex };
    default:
      return previousState;
  }
};

const filterJobs = (jobs, searchRegex) => {
  return jobs
    .filter(({ lastBuild }) => {
      return lastBuild.displayName.match(searchRegex);
    })
    .map(({ lastBuild }) => {
      return { ...lastBuild };
    });
};
