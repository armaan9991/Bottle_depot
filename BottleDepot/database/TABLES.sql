-- 1. Wipe the old broken database completely clean
DROP DATABASE IF EXISTS recycling_depot;

-- 2. Build the fresh database
CREATE DATABASE recycling_depot;
USE recycling_depot;

-- 3. Create all tables in the correct order
CREATE TABLE PERSON(
                       personID int primary key auto_increment,
                       Email varchar(100) Not null,
                       Name varchar(100) not null,
                       Phone varchar(20) not null
);


CREATE TABLE EMPLOYEE(
    WorkID INT PRIMARY KEY AUTO_INCREMENT,
    EmployeeCode VARCHAR(10) UNIQUE,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    Phone VARCHAR(100) NOT NULL,
    Role VARCHAR(40) NOT NULL,
    WageRate DECIMAL(10,1) NOT NULL,
    DateOfHire DATE NOT NULL,
    Password VARCHAR(100) NOT NULL,
    SupervisorID INT NULL,
    CONSTRAINT fk_supervisorid
        FOREIGN KEY (SupervisorID)
        REFERENCES EMPLOYEE(WorkID)
        ON DELETE SET NULL
);



CREATE TABLE CUSTOMER(
                         CustomerID int PRIMARY key AUTO_INCREMENT,
                         Name VARCHAR(100) NOT NULL,
                         Phone VARCHAR(20) NOT NULL,
                         Email VARCHAR(100) NOT NULL
);

CREATE TABLE CONTAINER_TYPE(
                               ContainerTypeID INT PRIMARY KEY AUTO_INCREMENT,
                               Refund DECIMAL (10,3) NOT NULL DEFAULT 0.00,
                               CountMethod VARCHAR(50) NOT NULL,
                               Size_of_Container decimal(10,2) not null,
                               Material VARCHAR(30) NOT NULL
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
                         ShiftDuration DECIMAL(5,2) NOT NULL,
                         IsBusy BOOLEAN NOT NULL,
                         WorkID INT NOT NULL,
                         CONSTRAINT fk_schedule
                             Foreign Key (WorkID) REFERENCES EMPLOYEE(WorkID) on delete CASCADE
);

CREATE table DAILY_RECORD(
                             RecordID INT PRIMARY KEY AUTO_INCREMENT,
                             TotalTransaction INT NOT NULL DEFAULT 0,
                             TotalValuePaid DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                             TotalContainer INT NOT NULL DEFAULT 0,
                             TotalShipments INT NOT NULL DEFAULT 0,
                             Status VARCHAR(20) NOT NULL DEFAULT 'Open',
                             RecordDate DATE NOT NULL,
                             WorkID  INT NOT NULL,
                             CONSTRAINT fk_DailyRecord
                                 Foreign Key (WorkID) REFERENCES EMPLOYEE(WorkID) on delete RESTRICT
);

CREATE Table TRANSACTION(
                            TransactionID INT PRIMARY KEY AUTO_INCREMENT,
                            TransactionDate DATE NOT NULL,
                            Total DECIMAL(10,2)NOT NULL,
                            TotalContainers INT NOT NULL,
                            CustomerID INT NOT NULL,
                            WorkID INT NOT NULL,
                            RecordID INT NOT NULL,
                            CONSTRAINT fk_Transaction_emp
                                Foreign Key (WorkID) REFERENCES EMPLOYEE(WorkID) on delete RESTRICT,
                            CONSTRAINT fk_Transaction_cus
                                Foreign Key (CustomerID) REFERENCES CUSTOMER(CustomerID) on delete RESTRICT,
                            CONSTRAINT fk_Transaction_rec
                                Foreign Key (RecordID) REFERENCES DAILY_RECORD(RecordID) on delete RESTRICT
);

CREATE TABLE TRANSACTION_DETAIL (
                                    TransactionDetailID INT PRIMARY KEY AUTO_INCREMENT,
                                    TransactionID INT NOT NULL,
                                    Quantity INT NOT NULL,
                                    UnitValue DECIMAL(10,2) NOT NULL,
                                    Value DECIMAL(10,2) NOT NULL,
                                    ContainerTypeID INT NOT NULL,
                                    CONSTRAINT fk_detail_transaction
                                        FOREIGN KEY (TransactionID) REFERENCES TRANSACTION(TransactionID) ON DELETE CASCADE,
                                    CONSTRAINT fk_detail_containertype
                                        FOREIGN KEY (ContainerTypeID) REFERENCES CONTAINER_TYPE(ContainerTypeID) ON DELETE RESTRICT
);

CREATE Table SHIPMENT(
                         ShipmentID INT PRIMARY KEY AUTO_INCREMENT,
                         ShipmentDate DATE NOT NULL,
                         TotalValue DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                         TotalBags INT NOT NULL DEFAULT 0,
                         CompanyID INT NOT NULL,
                         CONSTRAINT fk_shipment
                             Foreign Key (CompanyID) REFERENCES RECYCLE_COMPANY(CompanyID) on delete RESTRICT
);

CREATE Table LABEL(
                      LabelID INT PRIMARY KEY AUTO_INCREMENT,
                      Weight DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                      TagDate DATE NOT NULL,
                      WorkID INT NOT NULL,
                      TransactionID INT NOT NULL,
                      ShipmentID INT NULL,
                      Status VARCHAR(20) NOT NULL DEFAULT 'Pending',
                      CONSTRAINT fk_label_emp
                          FOREIGN KEY (WorkID) REFERENCES EMPLOYEE(WorkID) ON DELETE RESTRICT,
                      CONSTRAINT fk_label_transaction
                          FOREIGN KEY (TransactionID) REFERENCES TRANSACTION(TransactionID) ON DELETE RESTRICT,
                      CONSTRAINT fk_label_shipment
                          FOREIGN KEY (ShipmentID) REFERENCES SHIPMENT(ShipmentID) ON DELETE SET NULL
);

-- 4. Insert all your initial test data
INSERT INTO CONTAINER_TYPE (Refund, CountMethod, Size_of_Container, Material)
VALUES
    (0.10, 'Count', 0.50, 'PET Plastic'),
    (0.10, 'Count', 1.00, 'Glass'),
    (0.10, 'Bag',   0.25, 'Aluminum'),
    (0.10, 'Bag',   0.25, 'Bi-Metal'),
    (0.10, 'Bag',   0.25, 'Tetra Pak');

INSERT INTO RECYCLE_COMPANY (CompanyName, Phone)
VALUES
    ('Green Loop Recycling', '403-555-0101'),
    ('EcoReturn Ltd.',       '403-555-0202');

INSERT INTO CUSTOMER (Name, Phone, Email)
VALUES
    ('Guest',    '503-555-1001',   'john@email.com'),
    ('John D.',  '403-555-1001', 'john@email.com'),
    ('Sarah M.', '403-555-1002', 'sarah@email.com');

INSERT INTO EMPLOYEE
(Name, Email, Phone, Role, WageRate, DateOfHire, Password)
VALUES
    ('Sara L.', 'sara@depot.com', '403-555-0001',
     'Admin', 22.00, '2023-01-15', 'admin123');

INSERT INTO EMPLOYEE
(Name, Email, Phone, Role, WageRate, DateOfHire, Password, SupervisorID)
VALUES
    ('Mike K.', 'mike@depot.com', '403-555-0002',
     'Employee', 17.00, '2024-03-10', 'emp123', 1),
    ('Rob J.',  'rob@depot.com',  '403-555-0003',
     'Employee', 17.00, '2024-06-01', 'emp123', 1);

INSERT INTO SCHEDULE
(ShiftDate, ShiftStart, ShiftEnd, ShiftDuration, IsBusy, WorkID)
VALUES
    (CURDATE(), '08:00:00', '16:00:00', 8.00, FALSE, 1),
    (CURDATE(), '09:00:00', '17:00:00', 8.00, TRUE,  2),
    (CURDATE(), '13:00:00', '21:00:00', 8.00, FALSE, 3);

INSERT INTO DAILY_RECORD
(TotalTransaction, TotalValuePaid, TotalContainer,
 TotalShipments, RecordDate, Status, WorkID)
VALUES
    (0, 0.00, 0, 0, CURDATE(), 'Open', 1);


SHOW DATABASE RECYCLE_COMPANY;