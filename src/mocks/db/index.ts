// src/mocks/db/index.ts
import type { MockDatabase, MockDBOperations } from '../types'
import type { User, Investor, Meeting, QA } from '../../types/models'

class MockDB implements MockDBOperations {
  private db: MockDatabase = {
    users: new Map(),
    investors: new Map(),
    meetings: new Map(),
    qas: new Map()
  };

  public users = {
    getAll: (): User[] => {
      return Array.from(this.db.users.values());
    },
    findById: (id: string): User | undefined => {
      return this.db.users.get(id);
    },
    findByEmail: (email: string): User | undefined => {
      return Array.from(this.db.users.values()).find(
        user => user.email === email
      );
    },
    create: (user: Omit<User, '_id'>): User => {
      const id = crypto.randomUUID();
      const newUser: User = {
        _id: id,
        ...user,
        created_at: new Date(),
        updated_at: new Date()
      };
      this.db.users.set(id, newUser);
      return newUser;
    },
    update: (id: string, data: Partial<User>): User | undefined => {
      const user = this.db.users.get(id);
      if (!user) return undefined;

      const updatedUser: User = {
        ...user,
        ...data,
        updated_at: new Date()
      };
      this.db.users.set(id, updatedUser);
      return updatedUser;
    },
    delete: (id: string): boolean => {
      return this.db.users.delete(id);
    }
  };

  public investors = {
    getAll: (): Investor[] => {
      return Array.from(this.db.investors.values());
    },
    findById: (id: string): Investor | undefined => {
      return this.db.investors.get(id);
    },
    findByEmail: (email: string): Investor | undefined => {
      return Array.from(this.db.investors.values()).find(
        investor => investor.basicInfo.email === email
      );
    },
    create: (investor: Omit<Investor, '_id'>): Investor => {
      const id = crypto.randomUUID();
      const newInvestor: Investor = {
        _id: id,
        ...investor,
        created_at: new Date(),
        updated_at: new Date()
      };
      this.db.investors.set(id, newInvestor);
      return newInvestor;
    },
    update: (id: string, data: Partial<Investor>): Investor | undefined => {
      const investor = this.db.investors.get(id);
      if (!investor) return undefined;

      const updatedInvestor: Investor = {
        ...investor,
        ...data,
        updated_at: new Date()
      };
      this.db.investors.set(id, updatedInvestor);
      return updatedInvestor;
    },
    delete: (id: string): boolean => {
      return this.db.investors.delete(id);
    }
  };

  public meetings = {
    getAll: (): Meeting[] => {
      return Array.from(this.db.meetings.values());
    },
    findById: (id: string): Meeting | undefined => {
      return this.db.meetings.get(id);
    },
    findByInvestorId: (investorId: string): Meeting[] => {
      return Array.from(this.db.meetings.values()).filter(
        meeting => meeting.investor_id === investorId
      );
    },
    create: (meeting: Omit<Meeting, '_id'>): Meeting => {
      const id = crypto.randomUUID();
      const newMeeting: Meeting = {
        _id: id,
        ...meeting,
        created_at: new Date(),
        updated_at: new Date()
      };
      this.db.meetings.set(id, newMeeting);
      return newMeeting;
    },
    update: (id: string, data: Partial<Meeting>): Meeting | undefined => {
      const meeting = this.db.meetings.get(id);
      if (!meeting) return undefined;

      const updatedMeeting: Meeting = {
        ...meeting,
        ...data,
        updated_at: new Date()
      };
      this.db.meetings.set(id, updatedMeeting);
      return updatedMeeting;
    },
    delete: (id: string): boolean => {
      return this.db.meetings.delete(id);
    }
  };

  public qas = {
    getAll: (): QA[] => {
      return Array.from(this.db.qas.values());
    },
    findById: (id: string): QA | undefined => {
      return this.db.qas.get(id);
    },
    findByMeetingId: (meetingId: string): QA[] => {
      return Array.from(this.db.qas.values()).filter(
        qa => qa.meeting_id === meetingId
      );
    },
    findByInvestorId: (investorId: string): QA[] => {
      return Array.from(this.db.qas.values()).filter(
        qa => qa.investor_id === investorId
      );
    },
    create: (qa: Omit<QA, '_id'>): QA => {
      const id = crypto.randomUUID();
      const newQA: QA = {
        _id: id,
        ...qa,
        created_at: new Date(),
        updated_at: new Date()
      };
      this.db.qas.set(id, newQA);
      return newQA;
    },
    update: (id: string, data: Partial<QA>): QA | undefined => {
      const qa = this.db.qas.get(id);
      if (!qa) return undefined;

      const updatedQA: QA = {
        ...qa,
        ...data,
        updated_at: new Date()
      };
      this.db.qas.set(id, updatedQA);
      return updatedQA;
    },
    delete: (id: string): boolean => {
      return this.db.qas.delete(id);
    }
  };
}

export const mockDB = new MockDB();