import Course, {ICourse }from '../models/courseModel';

class CourseService {
  async createCourse(data: ICourse) {
    const course = new Course(data);
    return await course.save();
  }

  async getCourses() {
    return await Course.find();
  }

  async getCourseById(id: string) {
    return await Course.findById(id);
  }

  async updateCourse(id: string, data: Partial<ICourse>) {
    return await Course.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteCourse(id: string) {
    return await Course.findByIdAndDelete(id);
  }
}

export default new CourseService();
