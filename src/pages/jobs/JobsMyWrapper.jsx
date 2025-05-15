import { useOutletContext } from "react-router-dom";
import JobsMy from "./JobsMy";

export default function JobsMyWrapper() {
    const { selectedJob, setSelectedJob } = useOutletContext();

    return <JobsMy selectedJob={selectedJob} setSelectedJob={setSelectedJob} />;
}
