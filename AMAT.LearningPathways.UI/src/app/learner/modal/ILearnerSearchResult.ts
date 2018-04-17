export interface ILearnerSearchResult {
    UID: string,
    SkillUid: string,
    Skill: string,
    CourseId: string,
    CourseName: string,
    Duration: number,
    IsMandatory: boolean,
    CompetencyList: string[],
    CourseOrder: number,
    CourseUID: number,
    IsSelected: boolean,
    IsCourseCompleted: boolean,
    LearningEnv: string,
    IsEnrichmentCourse: boolean,
    BasePrice: number


}