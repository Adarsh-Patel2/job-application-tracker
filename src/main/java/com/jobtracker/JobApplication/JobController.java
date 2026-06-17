package com.jobtracker.JobApplication;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
public class JobController {

    @Autowired
    private JobService jobService;

    // GET all jobs
    @GetMapping
    public List<Job> getAllJobs() {
        return jobService.getAllJobs();
    }

    // GET one job by id
    @GetMapping("/{id}")
    public Optional<Job> getJobById(@PathVariable int id) {
        return jobService.getJobById(id);
    }

    // POST — add new job
    @PostMapping
    public Job addJob(@RequestBody Job job) {
        return jobService.addJob(job);
    }

    // PUT — update existing job
    @PutMapping("/{id}")
    public Job updateJob(@PathVariable int id, @RequestBody Job job) {
        return jobService.updateJob(id, job);
    }

    // DELETE — remove a job
    @DeleteMapping("/{id}")
    public String deleteJob(@PathVariable int id) {
        jobService.deleteJob(id);
        return "Job deleted successfully";
    }
}
