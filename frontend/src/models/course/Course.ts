export default interface Course {
  id: string;
  name: string;
  description: string;
  dateCreated: Date;
  isEnrolled?: boolean;
  enrolledCount?: number;
}
