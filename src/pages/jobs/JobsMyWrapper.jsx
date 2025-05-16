import { useState } from "react";
import JobsMy from "./JobsMy";

export default function JobsMyWrapper() {
    const [selectedJob, setSelectedJob] = useState(null);

    return <JobsMy selectedJob={selectedJob} setSelectedJob={setSelectedJob} />;
}
