"use strict";

import { differenceInSeconds } from "date-fns";
import { isSuperAdmin } from "../../helpers/common.js";
import { searchType, startingBigRefNo } from "../../helpers/constance.js";
import { responseSend } from "../../helpers/responseSend.js";
import projectsModel from "../../models/projects.model.js";
import {
  insertProjects,
  readAllProjects,
  readProjects,
  updateProjects,
} from "./projects.service.js";
import { readCustomers } from "../auth/auth.service.js";

function convertToQueryObject(queryString) {
  // List of MongoDB comparison operators for dates
  const dateOperators = ["$gte", "$lte", "$gt", "$lt", "$eq", "$ne"];

  return JSON.parse(queryString, (key, value) => {
    // Handle regex patterns
    if (typeof value === "string") {
      const regexMatch = value.match(/^\/(.*?)\/([gimsuy]*)$/);
      if (regexMatch) {
        // Convert string that looks like a regex to RegExp object
        return new RegExp(regexMatch[1], regexMatch[2]);
      }

      // Check if the current context should trigger date conversion
      if (
        dateOperators.includes(key) &&
        value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
      ) {
        // Convert ISO 8601 date strings to JavaScript Date objects
        return new Date(value);
      }
    }
    return value;
  });
}
const project_list_field = {
  title: 1,
  big_ref_no: 1,
  project_id: 1,
  project_background: 1,
  project_location: 1,
  project_publishing_date: 1,
  estimated_project_completion_date: 1,
  sectors: 1,
  cpv_codes: 1,
  regions: 1,
};
const project_all_field = {
  title: 1,
  big_ref_no: 1,
  project_id: 1,
  project_name: 1,
  project_background: 1,
  project_location: 1,
  project_status: 1,
  project_publishing_date: 1,
  estimated_project_completion_date: 1,
  client_name: 1,
  client_address: 1,
  funding_agency: 1,
  sectors: 1,
  regions: 1,
  cpv_codes: 1,
  is_active: 1,
  createdAt: 1,
};
const project_limit_field = {
  title: 1,
  big_ref_no: 1,
  project_id: 1,
  project_name: 1,
  project_background: 1,
  project_location: 1,
  project_status: 1,
  project_publishing_date: 1,
  estimated_project_completion_date: 1,
  sectors: 1,
  cpv_codes: 1,
  regions: 1,
  is_active: 1,
  createdAt: 1,
};

export const projectsAllList = async (req, res, next) => {
  try {
    const {
      keywords,
      search_type,
      pageNo,
      limit,
      sortBy,
      sortField,
      cpv_codes,
      sectors,
      regions,
      location,
      funding_agency,
      extraFilter = null,
      search_type_filter = null,
      country = null,
      raw_query,
      query_type,
      exclude_words = null,
    } = req.query;

    if (query_type === "raw_query") {
      const pipeline = convertToQueryObject(raw_query);
      const result = await projectsModel.aggregate(pipeline, {
        allowDiskUse: true,
      });
      // Counting total results
      let sliceCount = 1;

      const countPipeline = [
        ...pipeline.slice(0, sliceCount),
        { $count: "count" },
      ];
      const countResult = await projectsModel.aggregate(countPipeline, {
        allowDiskUse: true,
      });
      const count = countResult[0]?.count || 0;
      const query = pipeline;

      const re = { result, count, query };
      responseSend(res, 201, "Projects records", { ...re, ...req.query });
    } else {
      let filter = { is_active: true, is_deleted: false };
      let select = project_list_field;
      let orAdvCon = [];
      let orCon = [];
      let keywordsList = keywords
        ? keywords.split(",").map((kw) => kw.trim())
        : [];

      let condition = 0;
      if (keywords && exclude_words) {
        condition = 1; // Both keywords and exclude_words exist
      } else if (keywords) {
        condition = 2; // Only keywords exist
      } else if (exclude_words) {
        condition = 3; // Only exclude_words exist
      }

      if (search_type === searchType.EXACT) {
        console.log(condition, "conditionconditioncondition");

        switch (condition) {
          case 1:
            // Both keywords and exclude_words exist
            orAdvCon.push({
              $and: [
                {
                  $or: [
                    {
                      project_background: {
                        $regex: new RegExp(keywords.trim()),
                        $options: "m",
                      },
                    },
                    {
                      title: {
                        $regex: new RegExp(keywords.trim()),
                        $options: "m",
                      },
                    },
                  ],
                },
                {
                  $and: [
                    {
                      project_background: {
                        $not: {
                          $regex: new RegExp(exclude_words.trim()),
                          $options: "m",
                        },
                      },
                    },
                    {
                      title: {
                        $not: {
                          $regex: new RegExp(exclude_words.trim()),
                          $options: "m",
                        },
                      },
                    },
                  ],
                },
              ],
            });
            break;

          case 2:
            // Only keywords exist
            orAdvCon.push({
              $and: [
                {
                  $or: [
                    {
                      project_background: {
                        $regex: new RegExp(keywords.trim()),
                        $options: "m",
                      },
                    },
                    {
                      title: {
                        $regex: new RegExp(keywords.trim()),
                        $options: "m",
                      },
                    },
                  ],
                },
              ],
            });
            console.log(JSON.stringify(orAdvCon), "Keywords case");
            break;

          case 3:
            // Only exclude_words exist
            orAdvCon.push({
              $and: [
                {
                  $and: [
                    {
                      project_background: {
                        $not: {
                          $regex: new RegExp(exclude_words.trim()),
                          $options: "m",
                        },
                      },
                    },
                    {
                      title: {
                        $not: {
                          $regex: new RegExp(exclude_words.trim()),
                          $options: "m",
                        },
                      },
                    },
                  ],
                },
              ],
            });
            console.log(JSON.stringify(orAdvCon), "Exclude words case");
            break;

          default:
            console.log("No keywords or exclude_words provided.");
        }
      } else if (search_type === searchType.RELEVENT) {
        let excludeWordsList = exclude_words
          ? exclude_words.split(",").map((ew) => ew.trim())
          : [];
        switch (condition) {
          case 1:
            // Both keywords and exclude_words exist
            let keywordConditions = [];
            for (let ele of keywordsList) {
              keywordConditions.push({
                project_background: { $regex: new RegExp(ele), $options: "m" },
              });
              keywordConditions.push({
                title: { $regex: new RegExp(ele), $options: "m" },
              });
            }

            let excludeConditions = [];
            for (let ele of excludeWordsList) {
              excludeConditions.push({
                project_background: {
                  $not: { $regex: new RegExp(ele), $options: "m" },
                },
              });
              excludeConditions.push({
                title: { $not: { $regex: new RegExp(ele), $options: "m" } },
              });
            }

            orAdvCon.push({
              $and: [{ $or: keywordConditions }, { $and: excludeConditions }],
            });
            break;

          case 2:
            // Only keywords exist
            let keywordOnlyConditions = [];
            for (let ele of keywordsList) {
              keywordOnlyConditions.push({
                project_background: { $regex: new RegExp(ele), $options: "m" },
              });
              keywordOnlyConditions.push({
                title: { $regex: new RegExp(ele), $options: "m" },
              });
            }

            orAdvCon.push({
              $and: [{ $or: keywordOnlyConditions }],
            });
            console.log(JSON.stringify(orAdvCon), "Keywords case");
            break;

          case 3:
            // Only exclude_words exist
            let excludeOnlyConditions = [];
            for (let ele of excludeWordsList) {
              excludeOnlyConditions.push({
                project_background: {
                  $not: { $regex: new RegExp(ele), $options: "m" },
                },
              });
              excludeOnlyConditions.push({
                title: { $not: { $regex: new RegExp(ele), $options: "m" } },
              });
            }

            orAdvCon.push({
              $and: [{ $and: excludeOnlyConditions }],
            });
            console.log(JSON.stringify(orAdvCon), "Exclude words case");
            break;

          default:
            console.log("No keywords or exclude_words provided.");
        }
      } else if (search_type === searchType.ANY) {
        keywords = keywords.replace(/\s+/g, ",").split(",").join("|");
        search_type_filter = { $regex: new RegExp(keywords), $options: "i" };
      }

      for (let ele of keywordsList) {
        orCon.push({
          description: { $regex: new RegExp(ele.trim()), $options: "m" },
        });
        orCon.push({
          title: { $regex: new RegExp(ele.trim()), $options: "m" },
        });
      }
      if (extraFilter) filter = { ...filter, ...extraFilter };

      // if (keywords && keywords !== "")
      //     filter = {
      //         ...filter,
      //         $or: [
      //             { project_background: search_type_filter ? search_type_filter : { $regex: keywords, $options: 'i' } },
      //         ]
      //     };
      if (
        (keywords && keywords !== "") ||
        (exclude_words && exclude_words !== "")
      )
        filter = {
          ...filter,
          $or: orAdvCon.length > 0 ? orAdvCon : orCon,
        };

      if (cpv_codes && cpv_codes !== "")
        filter.cpv_codes = { $in: cpv_codes.split(",") };
      if (sectors && sectors !== "")
        filter.sectors = { $in: sectors.split(",") };
      if (regions && regions !== "") {
        filter = {
          ...filter,
          $or: [
            { regions: { $in: regions.split(",") } },
            { project_location: { $in: regions.split(",") } },
          ],
        };
      }
      if (funding_agency && funding_agency !== "")
        filter.funding_agency = { $in: funding_agency.split(",") };
      if (country && country !== "")
        filter.project_location = { $regex: country, $options: "i" };
      if (location && location !== "")
        filter.project_location = { $regex: location, $options: "i" };

      if (req.session && isSuperAdmin(req.session)) select = project_all_field;

      let result = await readAllProjects(
        filter,
        select,
        { [sortField]: parseInt(sortBy) },
        parseInt(pageNo) * parseInt(limit),
        parseInt(limit)
      );

      responseSend(res, 201, "Projects records", { ...result, ...req.query });
    }
  } catch (error) {
    next(error);
  }
};

export const projectsGet = async (req, res, next) => {
  try {
    const { _id, project_id } = req.query;

    if (!_id && !project_id) {
      throw new Error("Id or project_id is required");
    }

    let select = {};
    let filter = {};

    if (req.session?.plans && req.session?.plans.plan_name !== "Free") {
      const notExpired = differenceInSeconds(
        new Date(req.session?.plans.plan_expire_date),
        new Date()
      );

      if (notExpired >= 0) {
        let customerData = await readCustomers(
          { customer_id: req.session.customer_id },
          { tenders_filter: 1 }
        );
        let accessFilter = {
          project_id: project_id,
        };

        let search_type_filter = null;
        if (customerData.tenders_filter.search_type) {
          if (customerData.tenders_filter.search_type === searchType.EXACT) {
            search_type_filter = customerData.tenders_filter.keywords;
          } else if (
            customerData.tenders_filter.search_type === searchType.RELEVENT
          ) {
            search_type_filter = {
              $regex: customerData.tenders_filter.keywords,
              $options: "m",
            };
          } else if (
            customerData.tenders_filter.search_type === searchType.ANY
          ) {
            customerData.tenders_filter.keywords =
              customerData.tenders_filter.keywords
                .replace(/\s+/g, "")
                .split(",")
                .join("|");
            search_type_filter = {
              $regex: customerData.tenders_filter.keywords,
              $options: "i",
            };
          }
        }

        if (
          customerData.tenders_filter.keywords &&
          customerData.tenders_filter.keywords !== ""
        )
          accessFilter = {
            ...accessFilter,
            $or: [
              {
                project_background: search_type_filter
                  ? search_type_filter
                  : {
                      $regex: customerData.tenders_filter.keywords,
                      $options: "i",
                    },
              },
            ],
          };
        if (
          customerData.tenders_filter.sectors &&
          customerData.tenders_filter.sectors.length > 0
        )
          accessFilter.sectors = { $in: customerData.tenders_filter.sectors };
        if (
          customerData.tenders_filter.funding_agency &&
          customerData.tenders_filter.funding_agency.length > 0
        )
          accessFilter.funding_agency = {
            $in: customerData.tenders_filter.funding_agency,
          };
        if (
          customerData.tenders_filter.cpv_codes &&
          customerData.tenders_filter.cpv_codes.length > 0
        )
          accessFilter.cpv_codes = {
            $in: customerData.tenders_filter.cpv_codes,
          };
        if (
          customerData.tenders_filter.regions &&
          customerData.tenders_filter.regions.length > 0
        ) {
          accessFilter = {
            ...accessFilter,
            $or: [
              { regions: { $in: customerData.tenders_filter.regions } },
              { country: { $in: customerData.tenders_filter.regions } },
            ],
          };
        }
        const fullAccessAllowed = await readProjects(accessFilter, { _id: 1 });
        if (fullAccessAllowed) {
          select = project_all_field;
        } else {
          select = project_limit_field;
        }
      } else {
        select = project_limit_field;
      }
    } else {
      select = project_limit_field;
    }

    if (_id) filter = { _id };
    else filter = { project_id: project_id };

    let result = await readProjects(filter, select);

    responseSend(res, 201, "Projects single record", result);
  } catch (error) {
    next(error);
  }
};

export const projectsAdd = async (req, res, next) => {
  try {
    // Step 1: Generate big_ref_no based on existing tenders or fallback to count
    let baseRefNo = startingBigRefNo;
    const latestProject = await projectsModel.findOne().sort({ createdAt: -1 });

    if (latestProject) {
      baseRefNo = parseInt(latestProject.big_ref_no.split("-")[1]);
    } else {
      // const count = await contractAwardModel.count();
      // baseRefNo += count;
    }

    // Assign big_ref_no to the new tender
    req.body.big_ref_no = "P-" + (baseRefNo + 1);
    let result = await insertProjects(req.body);

    responseSend(res, 201, "Projects added successfully", result);
  } catch (error) {
    next(error);
  }
};

// export const projectsAddMultiple = async (req, res, next) => {
//     try {
//         const { projects } = req.body;

//         let baseRefNo = startingBigRefNo;
//         const latestProject = await projectsModel.findOne().sort({ createdAt: -1 });

//         if (latestProject) {
//             // Extract the numeric part of big_ref_no from the latest contract and increment
//             baseRefNo = parseInt(latestProject.big_ref_no.split('-')[1]) + 1;
//         }

//         // Step 2: Assign big_ref_no to each contract and increment from the baseRefNo
//         projects.forEach((project, index) => {
//             project.big_ref_no = "P-" + (baseRefNo + index);
//             project.createdAt = new Date(Date.now() + index);
//         });

//         let result = await projectsModel.insertMany(projects);

//         responseSend(res, 201, "Projects data added successfully", result);

//     } catch (error) {
//         next(error);
//     }
// }
export const projectsAddMultiple = async (req, res, next) => {
  try {
    const { projects } = req.body;

    // Step 1: Deduplicate incoming projects based on the specified fields
    const uniqueProjects = projects.reduce((acc, project) => {
      if (
        !acc.some(
          (p) =>
            p.project_id === project.project_id &&
            p.project_name === project.project_name &&
            p.project_location === project.project_location &&
            p.project_publishing_date === project.project_publishing_date &&
            p.client_name === project.client_name &&
            p.project_status === project.project_status
        )
      ) {
        acc.push(project);
      }
      return acc;
    }, []);

    // Step 2: Filter projects to avoid inserting duplicates in the database
    const filteredProjects = [];
    for (const project of uniqueProjects) {
      const exists = await projectsModel.findOne({
        $or: [
          {
            project_id: project.project_id,
            project_name: project.project_name,
            project_location: project.project_location,
            project_publishing_date: project.project_publishing_date,
            client_name: project.client_name,
            project_status: project.project_status,
          },
        ],
      });

      if (!exists) {
        filteredProjects.push(project);
      }
    }

    // Step 3: Retrieve the latest project to generate baseRefNo
    let baseRefNo = startingBigRefNo;
    const latestProject = await projectsModel.findOne().sort({ createdAt: -1 });

    if (latestProject) {
      // Extract the numeric part of big_ref_no from the latest project and increment
      baseRefNo = parseInt(latestProject.big_ref_no.split("-")[1]) + 1;
    }
    const big_ref_no_list = [];

    // Step 4: Assign big_ref_no to each project and increment from the baseRefNo
    filteredProjects.forEach((project, index) => {
      project.big_ref_no = "P-" + (baseRefNo + index);
      project.createdAt = new Date(Date.now() + index);
      big_ref_no_list.push(project.big_ref_no);
    });

    // Step 5: Insert new projects
    if (filteredProjects.length > 0) {
      const result = await projectsModel.insertMany(filteredProjects);
      console.log("Inserted projects:", result);
      responseSend(res, 201, "Projects data added successfully", {
        big_refs: big_ref_no_list,
        data: result,
      });
    } else {
      console.log("No new projects to insert.");
      responseSend(res, 200, "No new projects to insert.", []);
    }
  } catch (error) {
    next(error);
  }
};

export const projectsUpdate = async (req, res, next) => {
  try {
    const { _id } = req.body;

    let result = await updateProjects({ _id }, req.body);

    responseSend(res, 201, "Projects updated successfully", result);
  } catch (error) {
    next(error);
  }
};

export const projectsDelete = async (req, res, next) => {
  try {
    const { _id } = req.query;

    await updateProjects({ _id }, { is_deleted: true, is_active: false });

    responseSend(res, 201, "Projects deleted successfully", {});
  } catch (error) {
    next(error);
  }
};
