// export interface ICurriculum{

//     uid:string,
//     skill:string,
//     courseid:string,
//     coursename:string,
//     duration:number,
//     ismandatory: boolean,
//     isselected: boolean,
//     competencylist:string[],
//     coursetype:string
// }

// export interface ICurriculum {

//     UID: string,
//     SkillUid: string,
//     CourseId: string,
//     CourseName: string,
//     Duration: number,
//     IsMandatory: boolean,
//     CompetencyList: string[],
//     CourseType: string,
//     CourseTypeDesc: string
// }
// export interface IHistoryCurriculum {

//         UID: string,
//         SkillUid: string,
//         CourseId: string,
//         CourseName: string,
//         Duration: number,
//         IsMandatory: boolean,
//         CompetencyList: string[],
//         CourseType: string,
//         CourseTypeUid: string,
//         CurrentYear: number,
//         CourseTypeDesc: string,
//         IsActive:boolean
//     }

export interface ICurriculum {

    UID: string,
    Skill: string,
    CourseId: string,
    CourseName: string,
    Duration: number,
    IsMandatory: boolean,
    CompetencyList: string[],
    CourseType: string,
    CourseTypeDesc: string,
    CourseOrder: number,
    IsActive: boolean
}

export interface ICourseCatalog {
    CourseUID: string,
    Skill: string,
    SkillUid: string,
    CourseId: string,
    CourseName: string,
    Duration: number,
    IsMandatory: boolean,
    CompetencyList: string[],
    CourseType: string,
    CourseTypeDesc: string,
    visible: boolean
}
export interface IHistoryCurriculum extends ICurriculum {
    SkillUid: string,
    CourseTypeUid: string,
    CurrentYear: number,
    visible: boolean;
}



export interface ISaveCurriculum {

    UID: string,
    IsMandatory: boolean
}

export interface IFetchCurriculum {

    CopyToRoleUID: string,
    CopyFromRoleUID: string,
    CalenderYear: number
}



export interface IEmployee {
    IS_ADMIN: boolean,
    IS_SUPER_ADMIN:boolean,
    EmployeeId: string,
    EmployeeName: string,
    IS_LEARNER: boolean,
    IS_CURRICULUM_ADMIN: boolean,
    IS_PATHWAY_SUBMITTED: boolean,
    Role_Name: string,
    IS_ROLE_SUBMITTED: boolean,
    SHOW_MY_APPROVAL_FLAG: boolean,
    PENDING_APPROVAL_COUNT: number,
    IsPathwayApproved:boolean,
    HAS_FROZEN:boolean,
    HAS_ACCESS:boolean,
    HAS_LEARNER_FROZEN:boolean,
    ExclusionListUrl:string,
    IS_DEFAULT:boolean,
    DEFAULT_ROLE_NAME:string

}


export interface ISaveCurriculum {

    UID: string,
    IsMandatory: boolean,
    CourseOrder: number;

}

export interface ICourse {
    uid: string,
    skill: string,
    courseid: string,
    coursename: string,
    duration: number,
    ismandatory: number,
    isselected: number,
    competencylist: string[],
    coursetype: string,
    CourseTypeDesc: string
}

// export interface ICourseDetail {

//     CourseId: string,
//     CourseName: string,
//     Duration: number,
//     CompetencyList: string[],
//     CourseDesc: string,
//     InstructorName: string
// }

export interface ISearchResult {
    CompetencyCourseMappingUID: string,
    Skill: string,
    CourseId: string,
    CourseName: string,
    Duration: number,
    IsMandatory: boolean,
    CompetencyList: string[],
    CourseType: string,
    CourseTypeDesc: string,
    IsSelected: boolean,
    IsCourseCompleted: boolean,
    BasePrice:number
}



function newFunction(): boolean {
    return false;
}

