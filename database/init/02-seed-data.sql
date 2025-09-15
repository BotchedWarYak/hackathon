-- Seed initial data for development
USE HackathonDB;
GO

-- Insert a default admin user (password: admin123)
-- Note: In production, this should be done through the application with proper password hashing
IF NOT EXISTS (SELECT 1 FROM Users WHERE Username = 'admin')
BEGIN
    INSERT INTO Users (Id, Username, Email, PasswordHash, Role, Permissions)
    VALUES (
        NEWID(),
        'admin',
        'admin@hackathon.com',
        '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeVMpYlqhoEK7Q4fW', -- bcrypt hash of 'admin123'
        'admin',
        '["read", "write", "delete", "admin"]'
    );
END
GO

-- Insert sample events for development
IF NOT EXISTS (SELECT 1 FROM Events WHERE Name = 'Advanced Threat Detection Exercise')
BEGIN
    DECLARE @AdminUserId NVARCHAR(36);
    SELECT @AdminUserId = Id FROM Users WHERE Username = 'admin';

    INSERT INTO Events (Id, Name, Description, Status, StartDate, EndDate, ParticipantCount, Organization, Type, CreatedBy, EventData)
    VALUES
    (
        NEWID(),
        'Advanced Threat Detection Exercise',
        'Multi-day exercise focusing on advanced persistent threat detection and response',
        'scheduled',
        '2024-11-20T09:00:00Z',
        '2024-11-22T17:00:00Z',
        45,
        'Cyber Defense Unit',
        'Red Team vs Blue Team',
        @AdminUserId,
        '{"teamSize": "medium", "numberOfTeams": 3, "operationType": ["dco", "both"], "aptProfile": "APT28 (Fancy Bear)", "participantSkillLevel": "intermediate", "industryFocus": "Financial Services", "complexityLevel": 3, "networkTopology": "complex", "requiredSystems": ["Windows Domain Controller", "Linux Servers", "Web Applications", "SIEM Platform"], "deploymentType": "cloud"}'
    ),
    (
        NEWID(),
        'Incident Response Training',
        'Hands-on incident response simulation with real-world scenarios',
        'active',
        '2024-11-15T09:00:00Z',
        '2024-11-15T17:00:00Z',
        12,
        'SOC Team',
        'Tabletop Exercise',
        @AdminUserId,
        '{"teamSize": "small", "numberOfTeams": 1, "operationType": ["dco"], "participantSkillLevel": "beginner", "complexityLevel": 2}'
    ),
    (
        NEWID(),
        'Network Defense Bootcamp',
        'Comprehensive network defense training covering monitoring, detection, and response',
        'draft',
        '2024-12-01T09:00:00Z',
        '2024-12-05T17:00:00Z',
        25,
        'IT Security',
        'Training Exercise',
        @AdminUserId,
        '{"teamSize": "medium", "numberOfTeams": 2, "operationType": ["dco"], "participantSkillLevel": "mixed", "complexityLevel": 3}'
    ),
    (
        NEWID(),
        'Social Engineering Assessment',
        'Organization-wide phishing and social engineering awareness exercise',
        'completed',
        '2024-11-10T09:00:00Z',
        '2024-11-10T17:00:00Z',
        100,
        'All Departments',
        'Red Team Exercise',
        @AdminUserId,
        '{"teamSize": "enterprise", "numberOfTeams": 10, "operationType": ["oco"], "participantSkillLevel": "mixed", "complexityLevel": 1}'
    );
END
GO

PRINT 'Sample data seeded successfully!';