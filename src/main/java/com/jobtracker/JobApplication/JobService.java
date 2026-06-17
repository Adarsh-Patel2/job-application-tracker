package com.jobtracker.JobApplication;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    // Get all jobs
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    // Get one job by id
    public Optional<Job> getJobById(int id) {
        return jobRepository.findById(id);
    }

    // Add a new job
    public Job addJob(Job job) {
        return jobRepository.save(job);
    }

    // Update an existing job
    public Job updateJob(int id, Job updatedJob) {
        updatedJob.setId(id);
        return jobRepository.save(updatedJob);
    }

    // Delete a job
    public void deleteJob(int id) {
        jobRepository.deleteById(id);
    }
}