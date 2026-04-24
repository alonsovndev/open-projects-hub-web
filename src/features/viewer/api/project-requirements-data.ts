import type { ProjectRequirementsRecord } from "@/features/viewer/types";

export const projectRequirementsData: ProjectRequirementsRecord = {
  code: "PRJ-123456.",
  projectTitle: "Clinic Management System",
  stories: [
    {
      id: "appointment-scheduling",
      title: "Appointment Scheduling System",
      userStory: {
        userRole: "clinic patient",
        goal: "schedule an appointment with my doctor online",
        benefit: "I can book a convenient time without calling the clinic",
      },
      status: "Approved",
      acceptanceCriteria: [
        {
          given: "I am logged into the clinic portal",
          when: "I select a doctor and a time slot",
          then: "the appointment is successfully booked and I receive a confirmation email",
        },
        {
          given: "I try to book an appointment",
          when: "the selected time slot is already taken",
          then: "I see an error message and can choose a different time",
        },
      ],
    },
    {
      id: "medical-records-access",
      title: "Access to Medical Records",
      userStory: {
        userRole: "clinic patient",
        goal: "view my medical history and lab results",
        benefit: "I can stay informed about my health without visiting the clinic",
      },
      status: "Approved",
      acceptanceCriteria: [
        {
          given: "I am logged into the clinic portal",
          when: "I navigate to the medical records section",
          then: "I can see a list of my past appointments and lab results",
        },
        {
          given: "I view a lab result",
          when: "I click on a specific test",
          then: "I see detailed information about the test and its results",
        },
      ],
    },
  ],
};
