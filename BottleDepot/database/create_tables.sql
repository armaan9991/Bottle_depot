Create database if NOT EXISTS recycling_depot;
use recycling_depot;

create table person(
	personID int primary key auto_increment,
    Email varchar(100) Not null,
    Name varchar(100) not null,
    Phone varchar(20) not null
    );

create table EMPLOYEE(
        WorkID INT PRIMARY KEY AUTO_INCREMENT,
        Name VARCHAR(100) NOT NULL,
        Email VARCHAR(100) not NULL,
        Phone VARCHAR(100) NOT NULL,
        Role VARCHAR(40) NOT NULL,
        WageRate DECIMAL(10,1) NOT NULL,
        DataOfHire DATE NOT NULL,
        Password VARCHAR(100) NOT NULL ,
        supervisorId INT NULL,
        Constraint fk_supervisiorid
        Foreign Key (supervisorId) REFERENCES EMPLOYEE(WorkID) on delete set NULL
);

create table customer(
    CustomerID int PRIMARY key AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Phone VARCHAR(20) NOT NULL,
    Email VARCHAR(100) NOT NULL
);

