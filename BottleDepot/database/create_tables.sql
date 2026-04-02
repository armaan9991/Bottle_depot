Create database if NOT EXISTS recycling_depot;
use recycling_depot;

create table person(
	personID int primary key auto_increment,
    Email varchar(100) Not null,
    Name varchar(100) not null,
    Phone varchar(20) not null
    );

create table
