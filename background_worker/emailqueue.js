import { sendmail } from "../email/sendmail";
import { queue } from "./task_queue";

queue.process(async(job)=>{
    const{to,sub,text}=job.data;
    console.log("processing email.....")
    await sendmail(to,sub,text)
    console.log("email sent");
})