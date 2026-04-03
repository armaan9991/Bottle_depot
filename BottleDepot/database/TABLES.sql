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
    ShiftDuration DECIMAL(2,2) NOT NULL,
    IsBusy BOOLEAN NOT NULL,
    WorkID INT NOT NULL,
    CONSTRAINT fk_schedule
    Foreign Key (WorkID) REFERENCES EMPLOYEE(WorkID) on delete CASCADE 
);

-- had typo error in totaltranscation.
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
    RecordID INT NOT NULL,
    CONSTRAINT fk_Transaction_emp
    Foreign Key (WorkID) REFERENCES EMPLOYEE(WorkID) on delete RESTRICT,
    CONSTRAINT fk_Transaction_cus
    Foreign Key (CustomerID) REFERENCES CUSTOMER(CustomerID) on delete RESTRICT,
    CONSTRAINT fk_Transaction_rec
    Foreign Key (RecordID) REFERENCES DAILY_RECORD(RecordID) on delete RESTRICT
);

CREATE TABLE TRANSACTION_DETAIL (
    TransactionDetailID INT   PRIMARY KEY AUTO_INCREMENT,
    TransactionID     INT    NOT NULL,
    Quantity    INT    NOT NULL,
    UnitValue    DECIMAL(2,2) NOT NULL,
    Value   DECIMAL(5,2) NOT NULL,
    ContainerTypeID  INT  NOT NULL,
    CONSTRAINT fk_detail_transaction
        FOREIGN KEY (TransactionID) REFERENCES TRANSACTION(TransactionID)
        ON DELETE CASCADE,
    CONSTRAINT fk_detail_containertype
        FOREIGN KEY (ContainerTypeID) REFERENCES CONTAINER_TYPE(ContainerTypeID)
        ON DELETE RESTRICT
);
create Table  LABEL(
    LabelID       INT     PRIMARY KEY AUTO_INCREMENT,
    Weight        DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    TagDate     DATE      NOT NULL,
    WorkID    INT     NOT NULL,
    TransactionID INT       NOT NULL,
    ShipmentID    INT     NULL,
    CONSTRAINT fk_label_emp
        FOREIGN KEY (WorkID)REFERENCES EMPLOYEE(WorkID)
        ON DELETE RESTRICT,
    CONSTRAINT fk_label_transaction 
    FOREIGN KEY (TransactionID) REFERENCES TRANSACTION(TransactionID)
        ON DELETE RESTRICT,
    CONSTRAINT fk_label_shipment
        FOREIGN KEY (ShipmentID) REFERENCES SHIPMENT(ShipmentID)
        ON DELETE SET NULL
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

ALTER TABLE DAILY_RECORD
RENAME COLUMN TotalTranscation TO TotalTransaction;

ALTER TABLE EMPLOYEE
RENAME COLUMN DataOfHire TO DateOfHire;

ALTER TABLE SCHEDULE
MODIFY COLUMN ShiftDuration DECIMAL(5,2) NOT NULL;

ALTER TABLE DAILY_RECORD
ADD COLUMN Status VARCHAR(20) NOT NULL DEFAULT 'Open';
ALTER TABLE DAILY_RECORD
ADD COLUMN TotalShipments INT NOT NULL DEFAULT 0;

ALTER TABLE TRANSACTION_DETAIL
MODIFY COLUMN UnitValue DECIMAL(10,2) NOT NULL;

ALTER TABLE TRANSACTION_DETAIL
MODIFY COLUMN Value DECIMAL(10,2) NOT NULL;
ALTER TABLE SHIPMENT
ADD COLUMN TotalBags INT NOT NULL DEFAULT 0;
ALTER TABLE LABEL
ADD COLUMN Status VARCHAR(20) NOT NULL DEFAULT 'Pending';


USE recycling_depot;

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

USE recycling_depot;
SHOW TABLES;