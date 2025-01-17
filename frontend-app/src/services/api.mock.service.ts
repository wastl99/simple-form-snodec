import type { Comment } from "@/types/Comment"
import type { Thread } from "@/types/Thread"
import type { Topic } from "@/types/Topic"
import type { User } from "@/types/User"

export interface LoginResponse {
  user?: User,
  error?: {
    email?: {
      required?: boolean
      notExisting?: boolean
    }
    password?: {
      required?: boolean
      wrong?: boolean
    }
  }
}


class ApiMockService {

  private users: User[] = [...mockUsers]
  private topics: Topic[] = [...mockTopics]
  private threads: Thread[] = [...mockThreads]
  private comments: Comment[] = [...mockComments]

  // Public methods

  async login(email: string): Promise<LoginResponse> {
    const user: User = {
      uuid: crypto.randomUUID(),
      email,
      username: email,
      created_at: new Date().toDateString(),
      color_hex: this.getRandomDarkColor(),
    }
    this.users.push(user)
    return {
      user
    }
  }

  async logout(user: User): Promise<void> {
    this.users = this.users.filter(u => u.uuid != user.uuid)
  }

  async getUsers(): Promise<User[]> {
    return structuredClone(this.users)
  }

  async getUserByUUID(uuid: string): Promise<User | null> {
    return structuredClone(this.users.find(user => user.uuid == uuid) ?? null)
  }

  async getTopics(): Promise<Topic[]> {
    return structuredClone(this.topics)
  }

  async getTopicByUUID(uuid: string): Promise<Topic | null> {
    return structuredClone(this.topics.find(topic => topic.uuid === uuid) ?? null)
  }

  async createTopic(title: string, description: string, user: User): Promise<void> {
    this.topics.push({
      uuid: this.getNewUuid(),
      title,
      description,
      created_at: this.now(),
      user: { ...user },
    })
  }

  async getThreadByUUID(uuid: string): Promise<Thread | null> {
    return structuredClone(this.threads.find(thread => thread.uuid === uuid) ?? null)
  }

  async createThread(title: string, topicUuid: string, user: User): Promise<void> {
    const topic = await this.getTopicByUUID(topicUuid)
    if (topic == null) {
      throw new Error(`Topic with uuid '${topicUuid}' not found.`)
    }
    this.threads.push({
      uuid: this.getNewUuid(),
      title,
      topic,
      created_at: this.now(),
      user: { ...user },
    })
  }

  async getThreadsByTopicUUID(uuid: string): Promise<Thread[]> {
    return structuredClone(this.threads.filter(thread => thread.topic.uuid === uuid))
  }

  async getCommentsByThreadUuid(uuid: string): Promise<Comment[]> {
    return structuredClone(this.comments.filter(comment => comment.thread.uuid === uuid))
  }

  async createComment(content: string, threadUuid: string, user: User): Promise<void> {
    const thread = await this.getThreadByUUID(threadUuid)
    if (thread == null) {
      throw new Error(`Thread with uuid '${threadUuid}' not found.`)
    }
    this.comments.push({
      uuid: this.getNewUuid(),
      content,
      created_at: this.now(),
      thread,
      user: { ...user },
    })
  }

  // Private methods

  private now(): string {
    return new Date().toISOString()
  }

  private getNewUuid(): string {
    return crypto?.randomUUID() ?? `UUID${new Date().getTime()}`
  }

  private getRandomDarkColor() {
    const rgbMin = 30
    const rgbMax = 120
    const rgb: number[] = []
    for (let i = 0; i < 3; i++) {
      rgb.push(Math.floor((Math.random() * (rgbMax - rgbMin)) + rgbMin))
    }
    const hex = rgb
      .map(num => num.toString(16)) // To HEX
      .map(numStr => numStr.length === 1 ? '0' + numStr : numStr) // Add leading zero
    return `#${hex[0]}${hex[1]}${hex[2]}`
  }

}

// Mock data

const mockUsers: Readonly<User[]> = [
  {
    uuid: '90fe2d9c-0b74-11ed-9873-08002771075f',
    username: 'Petrosilius Zwackelmann',
    email: 'petrosilius.zwackelmann@zwicki-buxtehude.de',
    color_hex: '#3d315b',
    created_at: '2015-03-11 02:40:19',
  },
  {
    uuid: '97c85a5f-0b74-11ed-9873-08002771075f',
    username: 'Wachtmeister Alois Dimpfelmoser',
    email: 'alois.dimpfelmoser@polizei.de',
    color_hex: '#444b6e',
    created_at: '2020-02-20 09:58:07',
  },
  {
    uuid: '9feb62b2-0b74-11ed-9873-08002771075f',
    username: 'Seppl1994',
    email: 'seppel.schubert@tum.de',
    color_hex: '#848607',
    created_at: '2017-09-25 03:00:00',
  },
  {
    uuid: 'a48fae48-0b74-11ed-9873-08002771075f',
    username: 'xXL9Sn1pr360Xx',
    email: 'kasperl.wimmer@tum.de',
    color_hex: '#4c6134',
    created_at: '2017-09-25 03:00:00',
  },
  {
    uuid: '7fea61b2-0b74-11ed-9873-08002771075f',
    username: 'Phil Toolan 🍀',
    email: 'philtoolan@gmail.com',
    color_hex: '#d31717',
    created_at: '2022-08-18 10:40:01',
  },
]

const mockTopics: Readonly<Topic[]> = [
  {
    uuid: 'aae74cc2-0b74-11ed-9873-08002771075f',
    title: 'Cake 🍰',
    description: 'Discussions about cake',
    created_at: '2022-07-23 20:08:03',
    user: mockUsers[2],
  },
  {
    uuid: 'b0eebc52-0b74-11ed-9873-08002771075f',
    title: 'Soup 🥣',
    description: 'Share your thoughts about soup',
    created_at: '2022-07-23 20:11:35',
    user: mockUsers[3],
  },
  {
    uuid: 'f38d81d7-0d18-11ed-9af8-08002771075f',
    title: 'Wonton / Dumplings 🥟',
    description: 'Share your thoughts about soup',
    created_at: '2022-07-23 20:11:35',
    user: mockUsers[3],
  },
]

const mockThreads: Readonly<Thread[]> = [
  {
    uuid: 'b60af287-0b74-11ed-9873-08002771075f',
    title: 'Sacher Torte',
    created_at: '2022-07-23 20:13:38',
    topic: mockTopics[0],
    user: mockUsers[2],
  },
  {
    uuid: 'bb73a5ae-0b74-11ed-9873-08002771075f',
    title: 'Eating cake with a straw',
    created_at: '2022-07-23 20:15:16',
    topic: mockTopics[0],
    user: mockUsers[0],
  },
  {
    uuid: '31d29be3-0d18-11ed-9af8-08002771075f',
    title: 'Is tea soup?',
    created_at: '2022-07-22 15:23:09',
    topic: mockTopics[1],
    user: mockUsers[3],
  },
  {
    uuid: '3c29a7f9-0d18-11ed-9af8-08002771075f',
    title: 'Soup seasoning',
    created_at: '2022-07-23 11:24:27',
    topic: mockTopics[1],
    user: mockUsers[0],
  },
  {
    uuid: '410716cd-0d18-11ed-9af8-08002771075f',
    title: 'Goulash soup is the best soup',
    created_at: '2022-07-26 21:26:12',
    topic: mockTopics[1],
    user: mockUsers[2],
  },
]

const mockComments: Readonly<Comment[]> = [
  {
    uuid: 'c1f8d260-0b74-11ed-9873-08002771075f',
    content: 'I like Sacher Torte, pretty neat Austrian dish.',
    created_at: '2022-07-23 20:18:06',
    thread: mockThreads[0],
    user: mockUsers[1],
  },
  {
    uuid: 'c5dfcb12-0b74-11ed-9873-08002771075f',
    content: '????',
    created_at: '2022-07-23 20:20:14',
    thread: mockThreads[1],
    user: mockUsers[2],
  },
  {
    uuid: 'cf0503cc-0b74-11ed-9873-08002771075f',
    content: 'Yeah, wtf dude',
    created_at: '2022-07-23 20:20:39',
    thread: mockThreads[1],
    user: mockUsers[3],
  },
  {
    uuid: 'd3663df9-0b74-11ed-9873-08002771075f',
    content: 'You kids need to expand your horizon. I always blend cake with some almond milk to make it more enjoyable.',
    created_at: '2022-07-23 20:24:33',
    thread: mockThreads[1],
    user: mockUsers[0],
  },
  {
    uuid: 'd9bdca23-0b74-11ed-9873-08002771075f',
    content: 'Not ok. Not even for a wizard.',
    created_at: '2022-07-23 20:25:46',
    thread: mockThreads[1],
    user: mockUsers[3],
  },
]


export const apiMockService = new ApiMockService()
