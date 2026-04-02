Create database if NOT EXISTS recycling_depot;
use recycling_depot;

create table PERSON(
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

create table CUSTOMER(
    CustomerID int PRIMARY key AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Phone VARCHAR(20) NOT NULL,
    Email VARCHAR(100) NOT NULL
);


create table CONTAINER_TYPE(
    ContainerTypeID INT PRIMARY KEY AUTO_INCREMENT
    Refund DECIMAL (10,3) NOT NULL,
    CountMethod VARCHAR(50) NOT NULL,
    Size_of_Container decimal(10,2) not null,
    Material VARCHAR(30) NOT NULL,
);


CREATE TABLE RECYCLE_COMPANY(
    CompanyID INT  PRIMARY KEY AUTO_INCREMENT,
    CompanyName VARCHAR(100) NOT NULL,
    Phone VARCHAR(20) NOT NULL
);


CREATE Table SCHEDULE(
    ScheduleID INT PRIMARY KEY AUTO_INCREMENT,
    ShiftDate DATE NOT NULL,
    ShiftStart TIME  NOT NULL,
    ShiftEnd TIME NOT NULL,
    ShiftDuration DECIMAL(2,2) NOT NULL,
    IsBusy BOOLEAN NOT NULL,
    WorkID INT NOT NULL
    CONSTRAINT fk_schedule
    Foreign Key (WorkID) REFERENCES EMPLOYEE(WorkID) on delete CASCADE 
);

create table DAILY_RECORD(
    RecordID INT PRIMARY KEY AUTO_INCREMENT,
    TotalTranscation INT NOT NULL DEFAULT 0,
    TotalValuePaid DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    TotalContainer INT NOT NULL DEFAULT 0,
    RecordDate DATE NOT NULL,
    WorkID  INT NOT NULL,
    CONSTRAINT fk_DailyRecord
    Foreign Key (WorkID) REFERENCES EMPLOYEE(WorkID)
    on delete RESTRICT    
);
CREATE Table Transaction(
    TransactionID INT PRIMARY KEY AUTO_INCREMENT,
    TransactionDate DATE NOT NULL,
    Total DECIMAL(10,2)NOT NULL,
    TotalContainers INT NOT NULL,
    CustomerID INT NOT NULL,
    WorkID INT NOT NULL,
    RecordID int NOT NULL,
    CONSTRAINT fk_Transaction_emp
    Foreign Key (WorkID) REFERENCES EMPLOYEE(WorkID) on delete RESTRICT,
    CONSTRAINT fk_Transaction_cus
    Foreign Key (CustomerID) REFERENCES CUSTOMER(CustomerID) on delete RESTRICT,
    CONSTRAINT fk_Transaction_rec
    Foreign Key (RecordID) REFERENCES DAILY_RECORD(RecordID) on delete RESTRICT
);


create Table SHIPMENT(
    ShipmentID INT PRIMARY KEY AUTO_INCREMENT,
    ShipmentDate DATE NOT NULL,
    TotalValue DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    CompanyID INT NOT NULL,
    CONSTRAINT fk_shipment
    Foreign Key (CompanyID) REFERENCES RECYCLE_COMPANY(CompanyID)
    on delete  RESTRICT
);