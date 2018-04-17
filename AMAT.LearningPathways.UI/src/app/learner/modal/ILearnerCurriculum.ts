export interface ILearnerCurriculum {

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
    BasePrice: number,
    IsCourseDeactivated?:boolean
}

export interface IEmployeeList {

    EMPLOYEE_ID: string,
    EMPLOYEE_NAME: string,
    IS_ROLE_SUBMITTED: boolean,
    IS_PATHWAY_SUBMITTED: boolean,
    COURSE_SUBMITTED_DATE: string,
    ROLE_NAME: string
    IS_APPROVED: boolean | null,
    TOTAL_PATHWAY_COST: number
}