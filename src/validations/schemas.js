import * as Yup from 'yup';

export const loginSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6,'Min 6 characters').required('Password required'),
});

export const registerSchema = Yup.object({
  name: Yup.string().min(2,'Too short').required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(8,'Min 8 characters').matches(/[A-Z]/,'1 uppercase letter').matches(/[0-9]/,'1 number').required('Password required'),
  confirm: Yup.string().oneOf([Yup.ref('password')],'Passwords must match').required('Confirm password'),
  role: Yup.string().oneOf(['manager','employee']).required('Select role'),
  department: Yup.string().required('Department required'),
});

export const projectSchema = Yup.object({
  name: Yup.string().min(2).required('Project name required'),
  description: Yup.string().max(400),
  deadline: Yup.date().required('Deadline required'),
  status: Yup.string().oneOf(['Todo','In Progress','Review','Done']).required(),
});

export const taskSchema = Yup.object({
  title: Yup.string().min(2).required('Title required'),
  projectId: Yup.string().required('Project required'),
  assigneeId: Yup.string().required('Assignee required'),
  status: Yup.string().required(),
  priority: Yup.string().required(),
  dueDate: Yup.date().required('Due date required'),
});

// export const profileSchema = Yup.object({
//   name: Yup.string().min(2).required(),
//   email: Yup.string().email().required(),
//   department: Yup.string(),
// });

export const profileSchema = Yup.object({
  name: Yup.string().min(2).required('Name is required'),
  email: Yup.string().email().required('Email is required'),
  department: Yup.string().required('Department is required'),
  password: Yup.string().min(6, 'Min 6 characters').required('Password is required'),
});