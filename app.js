// DEPENDECIES ===================================
const mysql = require("mysql");
const inquirer = require("inquirer");
const conTable = require("console.table");

// connection
const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your Password
  password: "",
  database: "employee_DB",
});
// Establishing connection with database
connection.connect(function (err) {
  if (err) throw err;
  console.log("\n WELCOME TO THE EMPLOYEE TRACKER! \n");
  mainMenu();
});

function mainMenu() {
  inquirer
    .prompt({
      name: "userAction",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View all the roles",
        "View all the departments",
        "View all employees",
        "View all employees by role",
        "View all employees by department",
        "View all employees by manager",
        "Add employee",
        "Add role",
        "Add department",
        "Update employee role",
        "Delete employee",
        "Delete role",
        "Delete department",
      ],
    })
    .then((userAnswer) => {
      // Switch case for user declaration
      switch (userAnswer.userAction) {
        case "View all the roles":
          viewAllRoles();
          break;

        case "View all the departments":
          viewAllDepartments();
          break;

        case "View all employees":
          viewAllEmployees();
          break;

        case "View all employees by role":
          viewAllEmpByRole();

        case "View all employees by department":
          viewAllEmpByDepartment();
          break;

        case "View all employees by manager":
          viewAllEmpByManager();
          break;

        case "Add employee":
          addEmployee();
          break;

        case "add department":
          addDept();
          break;

        case "add role":
          addRole();
          break;

        case "update employee":
          updateEmp();
          break;

        case "delete role":
          deleteRole();
          break;

        case "delete employee":
          deleteEmp();
          break;

        case "delete department":
          deleteDepartment();
          break;

        default:
          connection.end();
      }
    });
  // viewing all the roles =======================================================================
  function viewAllRoles() {
    const query = "SELECT * FROM roles";
    connection.query(query, function (err, res) {
      if (err) throw err;
      console.table(res);
      mainMenu();
    });
  }
  // viewing all the departments ==================================================================
  function viewAllDepartments() {
    const query = "SELECT * FROM department";
    connection.query(query, function (err, res) {
      if (err) throw err;
      console.table(res);
      mainMenu();
    });
  }

  // viewing all the employees ==================================================================
  function viewAllEmployees() {
    // Query for viewing all the employees
    const query = "SELECT * FROM employee";
    // Query for the connection
    connection.query(query, function (err, res) {
      if (err) throw err;
      // Displays the response within a table
      console.table(res);
      // Back to main Menu
      mainMenu();
    });
  }
  // viewing all employees by role ================================================================
  function viewAllEmpByRole() {
    let roleArray = [];
    connection.query("SELECT * FROM roles", function (err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        roleArray.push(res[i].title);
      }
      console.log(roleArray);
      inquirer
        .prompt([
          {
            type: "list",
            message: "Which roles of employees do you want to see?",
            choices: roleArray,
            name: "roles",
          },
        ])
        .then((answer) => {
          const roleChoice = answer.role;
          console.log(roleChoice);
          const query = `SELECT e.id AS ID, e.first_name AS 'First Name', e.last_name AS 'Last Name', roles.title AS Title, department.name AS Department, concat(m.first_name, '', m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.roles_id = role.id INNER JOIN department ON role.department ON role.department_id = department.id WHERE roles.title = '${answer.role} ORDER BY ID ASC`;
          //       "Select employee.first_name, employee.last_name, roles.title, roles.salary, department.name, employee_m.first_name as manager_firstname, employee_m.last_name as manager_lastname \
          // from employee \
          // inner join roles on roles.id =  employee.roles_id \
          // Left join department on roles.department_id = department.id \
          // Left join employee as employee_m on  employee.manager_id  = employee_m.id;";
          connection.query(query, (err, res) => {
            if (err) throw err;
            console.table(res);
            const roleName = [];
            for (let i = 0; i < res.length; i++) {
              if (res[i].title === roleChoice) {
                roleName.push(res[i].first_name + "" + res[i].last_name);
              }
              console.log(roleName);
            }
            // return to the main menu
            mainMenu();
          });
        });
    });
  }
  // to view all of the employees by the department ===========================================
  function viewAllEmpByDepartment() {
    // A global variable for the department array
    let deptArray = [];
  }
  // adding in new employee ===================================================================
  function addEmployee() {
    // Questions being asked for the user
    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the first name of the employee?",
          name: "firstName",
        },
        {
          type: "input",
          message: "What is the last name of the employee?",
          name: "lastName",
        },
        {
          type: "input",
          message: "What is the employees role id number?",
          name: "roleID",
        },
        {
          type: "input",
          message: "What is the manager id number?",
          name: "managerID",
        },
      ])
      .then(function (answer) {
        // query implementation
        connection.query(
          "INSERT INTO employee (first_name, last_name, roles_id, manager_id) VALUES (?, ?, ?, ?)",
          [answer.firstName, answer.lastName, answer.roleID, answer.managerID],
          function (err, res) {
            if (err) throw err;
            console.table(res);
            mainMenu();
          }
        );
      });
  }

  // to add a new department ============================================================
  function addDept() {
    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the name of the department you would like to add?",
          name: "departmentName",
        },
      ])
      .then((answer) => {
        connection.query(
          "INSERT INTO department (name) VALUES ?",
          [answer.departmentName],
          function (err, res) {
            if (err) throw err;
            console.table(res);
            mainMenu();
          }
        );
      });
  }

  // to add a new role ===================================================================
  function addRole() {
    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the name of the role?",
          name: "roleName",
        },
        {
          type: "input",
          message: "What is the salary for the role?",
          name: "salaryTotal",
        },
        {
          type: "input",
          message: "What is the department id number?",
          name: "departmentID",
        },
      ])
      .then(function (answer) {
        connection.query(
          "INSERT INTO roles (title, salary, department_id) (?, ?, ?)",
          [answer.roleName, answer.salaryTotal, answer.departmentID],
          function (err, res) {
            if (err) throw err;
            console.table(res);
            mainMenu();
          }
        );
      });
  }

  // For updating the employee =========================================================
  function updateEmp() {}
}
