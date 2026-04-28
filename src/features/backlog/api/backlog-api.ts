import type { Story, StoryStatus } from "@/features/backlog/types";

// Mock stories data
const mockStories: Story[] = [
  {
    id: "story-1",
    title: "User Authentication System",
    description: "Implement complete user authentication with email and password",
    acceptanceCriteria: [
      "Users can register with email and password",
      "Users can log in with valid credentials",
      "Password reset functionality is available",
    ],
    status: "backlog",
    priority: "high",
    storyPoints: 8,
    assignee: "John Doe",
    projectId: "PROJ-2024",
    projectName: "E-Commerce Platform",
    createdAt: "2024-04-20T10:00:00Z",
    updatedAt: "2024-04-20T10:00:00Z",
  },
  {
    id: "story-2",
    title: "Product Search Filter",
    description: "Add advanced filtering options for product search",
    acceptanceCriteria: [
      "Users can filter by price range",
      "Users can filter by category",
      "Filters persist across sessions",
    ],
    status: "backlog",
    priority: "medium",
    storyPoints: 5,
    assignee: "Jane Smith",
    projectId: "PROJ-2024",
    projectName: "E-Commerce Platform",
    createdAt: "2024-04-19T14:30:00Z",
    updatedAt: "2024-04-19T14:30:00Z",
  },
  {
    id: "story-3",
    title: "Shopping Cart Functionality",
    description: "Implement shopping cart with add/remove items",
    acceptanceCriteria: [
      "Users can add products to cart",
      "Users can update quantities",
      "Cart total is calculated correctly",
    ],
    status: "ready",
    priority: "high",
    storyPoints: 13,
    projectId: "PROJ-2024",
    projectName: "E-Commerce Platform",
    createdAt: "2024-04-18T09:15:00Z",
    updatedAt: "2024-04-21T11:20:00Z",
  },
  {
    id: "story-4",
    title: "Payment Gateway Integration",
    description: "Integrate Stripe payment processing",
    acceptanceCriteria: [
      "Users can enter payment details",
      "Payment is processed securely",
      "Order confirmation is sent",
    ],
    status: "in-progress",
    priority: "high",
    storyPoints: 13,
    assignee: "John Doe",
    projectId: "PROJ-2024",
    projectName: "E-Commerce Platform",
    createdAt: "2024-04-17T16:45:00Z",
    updatedAt: "2024-04-22T10:00:00Z",
  },
  {
    id: "story-5",
    title: "User Profile Page",
    description: "Create user profile with editable information",
    acceptanceCriteria: [
      "Users can view their profile",
      "Users can edit their information",
      "Changes are saved successfully",
    ],
    status: "review",
    priority: "medium",
    storyPoints: 5,
    assignee: "Jane Smith",
    projectId: "PROJ-2024",
    projectName: "E-Commerce Platform",
    createdAt: "2024-04-16T13:20:00Z",
    updatedAt: "2024-04-23T15:30:00Z",
  },
  {
    id: "story-6",
    title: "Email Notifications",
    description: "Send email notifications for orders and updates",
    acceptanceCriteria: [
      "Order confirmation emails are sent",
      "Shipping update emails are sent",
      "Email templates are branded",
    ],
    status: "done",
    priority: "medium",
    storyPoints: 8,
    assignee: "John Doe",
    projectId: "PROJ-2024",
    projectName: "E-Commerce Platform",
    createdAt: "2024-04-15T10:00:00Z",
    updatedAt: "2024-04-24T12:00:00Z",
  },
  {
    id: "story-7",
    title: "Dashboard Analytics",
    description: "Display sales analytics on admin dashboard",
    acceptanceCriteria: ["Show total sales", "Show top products", "Show customer metrics"],
    status: "backlog",
    priority: "low",
    storyPoints: 8,
    projectId: "ADMIN-2024",
    projectName: "Admin Portal",
    createdAt: "2024-04-14T11:30:00Z",
    updatedAt: "2024-04-14T11:30:00Z",
  },
];

export const getStories = (): Story[] => {
  return mockStories;
};

export const getStoryById = (id: string): Story | undefined => {
  return mockStories.find((story) => story.id === id);
};

export const updateStoryStatus = async (
  storyId: string,
  newStatus: StoryStatus
): Promise<Story> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 300));

  const story = mockStories.find((s) => s.id === storyId);
  if (!story) {
    throw new Error("Story not found");
  }

  story.status = newStatus;
  story.updatedAt = new Date().toISOString();
  return story;
};

export const updateStory = async (storyId: string, updates: Partial<Story>): Promise<Story> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  const story = mockStories.find((s) => s.id === storyId);
  if (!story) {
    throw new Error("Story not found");
  }

  Object.assign(story, updates, { updatedAt: new Date().toISOString() });
  return story;
};

export const deleteStory = async (storyId: string): Promise<void> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 300));

  const index = mockStories.findIndex((s) => s.id === storyId);
  if (index !== -1) {
    mockStories.splice(index, 1);
  }
};
