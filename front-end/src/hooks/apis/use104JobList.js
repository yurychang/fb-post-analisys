import useSWR from 'swr';

const use104JobList = (searchStr) => {
    return useSWR(
        searchStr && ['http://localhost:3000/104', searchStr],
        ([url, search]) => fetch(`${url}${search}`).then((r) => r.json())
    );
};

export default use104JobList;
