export interface UserStoryNarrative {
  userRole: string;
  goal: string;
  benefit: string;
}

export interface AcceptanceCriterion {
  given: string;
  when: string;
  then: string;
}

export interface ProjectRequirementStory {
  id: string;
  title: string;
  userStory: UserStoryNarrative;
  status: "Approved";
  acceptanceCriteria: AcceptanceCriterion[];
}

export interface ProjectRequirementsRecord {
  code: string;
  projectTitle: string;
  stories: ProjectRequirementStory[];
}

export interface ProjectCodeFormValues {
  projectCode: string;
}
