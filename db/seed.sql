INSERT INTO department (name)
VALUES ('Sales'), ('Engineering'),('HR');

INSERT INTO roles (title, salary, department_id)
VALUES ('Sales Lead', 110000, 1), ('Sales Person', 70000, 1), ('Senior Engineer', 160000, 2), ('Software Engineer', 100000,2), ('Senior HR', 90000, 3), ('HR Correspondent', 80000, 3 );

INSERT INTO employee (first_name, last_name, roles_id, manager_id)
VALUES ('Han', 'Solo', 1, null), ('Leia','Skywalker', 2, null), ('Luke', 'Skywalker', 1, 1), ('Rey', 'Palpatine', 2, 1), ('Kylo','Ren', 2, null), ('Obi-Wan', 'Kenobi', 3,3);

SELECT * FROM department;
SELECT * FROM roles;
SELECT * FROM employee
INNER JOIN roles
ON roles.id = employee.roles_id;
