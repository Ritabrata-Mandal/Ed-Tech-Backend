const express = require("express");
const router = express.Router();
const {auth} = require("../middlewares/Auth");

const {
  deleteAccount,
  updateProfile,
  getUserDetails,
  updateDisplayPicture,
  getEnrolledCourses,
} = require("../controllers/profile")

// Profile routes


// Delete User Account
router.delete("/deleteProfile", auth, deleteAccount)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getUserDetails)

// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)

module.exports = router

/*eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJpdGFicmF0YW0xNTA0MjAwNUBnbWFpbC5jb20iLCJpZCI6IjY5NDQ1ZDQ2ZDE1N2ZmY2IzODhiODllNSIsInJvbGUiOiJTdHVkZW50IiwiaWF0IjoxNzY2MDkzNzM4LCJleHAiOjE3NjYxMDA5Mzh9.PZeW4dMTCaCsyZPWNp4fzV4C6c6FUjPPZvh3qX_F33A 



eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImN1cHdvcmxkMjU4QGdtYWlsLmNvbSIsImlkIjoiNjk0NDVjYjNkMTU3ZmZjYjM4OGI4OWRmIiwicm9sZSI6IlN0dWRlbnQiLCJpYXQiOjE3NjYwOTM3NzQsImV4cCI6MTc2NjEwMDk3NH0.HZ_3-rPZfxdnfTVaFqPFlZAD09MWOza5HiY2XZiI8ms*/