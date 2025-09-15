-- Create the main database
USE master;
GO

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'HackathonDB')
BEGIN
    CREATE DATABASE HackathonDB;
END
GO

USE HackathonDB;
GO

-- Create Users table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
BEGIN
    CREATE TABLE Users (
        Id NVARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
        Username NVARCHAR(100) NOT NULL UNIQUE,
        Email NVARCHAR(255) NOT NULL UNIQUE,
        PasswordHash NVARCHAR(255) NOT NULL,
        Role NVARCHAR(50) NOT NULL DEFAULT 'user',
        Permissions NVARCHAR(MAX) NOT NULL DEFAULT '[]',
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
    );
END
GO

-- Create ChatMessages table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ChatMessages' AND xtype='U')
BEGIN
    CREATE TABLE ChatMessages (
        Id NVARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
        UserId NVARCHAR(36) NOT NULL,
        Message NVARCHAR(MAX) NOT NULL,
        Response NVARCHAR(MAX) NOT NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
    );
END
GO

-- Create Events table for the training platform
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Events' AND xtype='U')
BEGIN
    CREATE TABLE Events (
        Id NVARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
        Name NVARCHAR(255) NOT NULL,
        Description NVARCHAR(MAX),
        Status NVARCHAR(50) NOT NULL DEFAULT 'draft',
        StartDate DATETIME2,
        EndDate DATETIME2,
        ParticipantCount INT DEFAULT 0,
        Organization NVARCHAR(255),
        Type NVARCHAR(100),
        EventData NVARCHAR(MAX), -- JSON for complex event configuration
        CreatedBy NVARCHAR(36),
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        FOREIGN KEY (CreatedBy) REFERENCES Users(Id)
    );
END
GO

-- Create Infrastructure table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Infrastructure' AND xtype='U')
BEGIN
    CREATE TABLE Infrastructure (
        Id NVARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
        EventId NVARCHAR(36) NOT NULL,
        Name NVARCHAR(255) NOT NULL,
        Status NVARCHAR(50) NOT NULL DEFAULT 'planned',
        TotalVMs INT DEFAULT 0,
        NetworkSegments INT DEFAULT 0,
        EstimatedResources NVARCHAR(MAX), -- JSON for resource estimates
        NetworkNodes NVARCHAR(MAX), -- JSON for network topology
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        FOREIGN KEY (EventId) REFERENCES Events(Id) ON DELETE CASCADE
    );
END
GO

-- Create indexes for better performance
CREATE NONCLUSTERED INDEX IX_Users_Username ON Users(Username);
CREATE NONCLUSTERED INDEX IX_Users_Email ON Users(Email);
CREATE NONCLUSTERED INDEX IX_ChatMessages_UserId ON ChatMessages(UserId);
CREATE NONCLUSTERED INDEX IX_ChatMessages_CreatedAt ON ChatMessages(CreatedAt);
CREATE NONCLUSTERED INDEX IX_Events_Status ON Events(Status);
CREATE NONCLUSTERED INDEX IX_Events_CreatedBy ON Events(CreatedBy);
CREATE NONCLUSTERED INDEX IX_Infrastructure_EventId ON Infrastructure(EventId);

-- Create trigger for updating UpdatedAt timestamp on Users
IF NOT EXISTS (SELECT * FROM sys.triggers WHERE name = 'TR_Users_UpdatedAt')
BEGIN
    EXEC('
    CREATE TRIGGER TR_Users_UpdatedAt ON Users
    AFTER UPDATE
    AS
    BEGIN
        SET NOCOUNT ON;
        UPDATE Users
        SET UpdatedAt = GETUTCDATE()
        FROM Users u
        INNER JOIN inserted i ON u.Id = i.Id;
    END');
END
GO

-- Create trigger for updating UpdatedAt timestamp on Events
IF NOT EXISTS (SELECT * FROM sys.triggers WHERE name = 'TR_Events_UpdatedAt')
BEGIN
    EXEC('
    CREATE TRIGGER TR_Events_UpdatedAt ON Events
    AFTER UPDATE
    AS
    BEGIN
        SET NOCOUNT ON;
        UPDATE Events
        SET UpdatedAt = GETUTCDATE()
        FROM Events e
        INNER JOIN inserted i ON e.Id = i.Id;
    END');
END
GO

-- Create trigger for updating UpdatedAt timestamp on Infrastructure
IF NOT EXISTS (SELECT * FROM sys.triggers WHERE name = 'TR_Infrastructure_UpdatedAt')
BEGIN
    EXEC('
    CREATE TRIGGER TR_Infrastructure_UpdatedAt ON Infrastructure
    AFTER UPDATE
    AS
    BEGIN
        SET NOCOUNT ON;
        UPDATE Infrastructure
        SET UpdatedAt = GETUTCDATE()
        FROM Infrastructure inf
        INNER JOIN inserted i ON inf.Id = i.Id;
    END');
END
GO

PRINT 'Database schema created successfully!';