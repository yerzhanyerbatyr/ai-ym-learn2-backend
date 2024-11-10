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

  async getVocabularyList(id: string) {
    const course = await Course.findById(id).exec();
    if (!course) {
      throw new Error('Course not found');
    }
    const vocabularyList = course.lessons.flatMap((lesson) =>
      lesson.tasks.map((task) => ({
        word: task.word,
        videoUrl: task.videoUrl,
      }))
    );
    return vocabularyList;
  }
}

export default new CourseService();
