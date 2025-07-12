-- Insert dummy users
INSERT INTO users (email, password_hash, role) VALUES
  ('alice@example.com', 'hashedpassword1', 'admin'),
  ('bob@example.com', 'hashedpassword2', 'employee'),
  ('carol@example.com', 'hashedpassword3', 'manager');

-- Insert dummy employees
INSERT INTO employees (name, email, position, department, salary, image_url) VALUES
  ('Alice Smith', 'alice.smith@company.com', 'HR Manager', 'HR', 70000, 'https://randomuser.me/api/portraits/women/1.jpg'),
  ('Bob Johnson', 'bob.johnson@company.com', 'Software Engineer', 'Engineering', 90000, 'https://randomuser.me/api/portraits/men/2.jpg'),
  ('Carol White', 'carol.white@company.com', 'Accountant', 'Finance', 65000, 'https://randomuser.me/api/portraits/women/3.jpg'); 