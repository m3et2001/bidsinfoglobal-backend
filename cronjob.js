import cron from "node-cron";
import { readAllCustomers } from "./app/features/auth/auth.service.js";
import { readAllTenders } from "./app/features/tenders/tenders.service.js";
import {
  tenders_all_field,
  tendersAllListForCron,
} from "./app/features/tenders/tenders.controller.js";
import {
  differenceInDays,
  differenceInSeconds,
  format,
  formatISO,
} from "date-fns";
import {
  sendCaDataMail,
  sendDataMail,
} from "./app/features/auth/auth.controller.js";
import {
  readAllRegions,
  readAllSectors,
} from "./app/features/masters/masters.service.js";
import { readAllGrants } from "./app/features/grants/grants.service.js";
import { readAllProjects } from "./app/features/projects/projects.service.js";
import { readAllContractAward } from "./app/features/contract_award/contract_award.service.js";
import { createObjectCsvWriter } from "csv-writer";
import { createReports } from "./app/features/reports/reports.service.js";
import { ADMIN_EMAIL, BASE_URL, searchType } from "./app/helpers/constance.js";
import { sendEMAIL } from "./app/utils/email.util.js";
import fs from "fs";
import { convertToQueryObject } from "./app/helpers/common.js";
import { contractAwardAllListForCron } from "./app/features/contract_award/contract_award.controller.js";

// this cron is related to send the mail to user about the tenders

cron.schedule('0 0 * * *', async function () {       // midnight
// cron.schedule("*/10 * * * * *", async function () { // testing
  try {
    console.log("Cron job started...");
    console.log("Fetching active customers with tenders_filter...");

    const customerData = await readAllCustomers(
      {
        status: "active",
        tenders_filter: { $exists: true, $not: { $size: 0 } },
      },
      {
        _id: 1,
        tenders_filter: 1,
        contract_awards_filter: 1,
        email: 1,
        full_name: 1,
        plans: 1,
      },
      { ["createdAt"]: -1 },
      0,
      10000
    );
    console.log(`Fetched ${customerData.result.length} active customers.`);

    for (let index = 0; index < customerData.result.length; index++) {
      const element = customerData.result[index];
      console.log(
        `Processing customer ${element.full_name} (ID: ${element._id})...`
      );

      if (element.plans && element.plans.plan_expire_date) {
        const notExpired = differenceInSeconds(
          element.plans.plan_expire_date,
          new Date()
        );
        const pendingDays = differenceInDays(
          element.plans.plan_expire_date,
          new Date()
        );

        if (notExpired) {
          console.log(`Plan is active. ${pendingDays} days remaining for expiry.`);

          // Fetching tenders data
          console.log(`Fetching tenders data for customer ${element._id}...`);
          const tendersData = await tendersAllListForCron(element?.tenders_filter,2000);
          console.log(`Fetched ${tendersData.result.length} tenders for customer ${element._id}.`);

          const regionsDataArray = [];
          tendersData.result.map(function (obj) {
              let index = regionsDataArray.findIndex(a => a.regions === obj.regions);

              if (index >= 0) {
                  regionsDataArray[index].data.push({
                      country: obj.country,
                      description: obj.description
                  });
              } else {
                  regionsDataArray.push({
                      regions: obj.regions,
                      data: [{
                          country: obj.country,
                          description: obj.description
                      }]
                  });
              }
          });

          console.log(`${tendersData?.result}...`);
          console.log(`Sending tenders data email to ${element.email}...`);
          sendDataMail(tendersData?.result || [], element._id, element.full_name, element.email, regionsDataArray, pendingDays);
          console.log(`Email sent for tenders data to ${element.email}.`);
          console.log(element)

          if (element?.contract_awards_filter) {
            // Fetching contract awards data
            console.log(
              `Fetching contract awards data for customer ${element._id}...`
            );
            const CaData = await contractAwardAllListForCron(
              element?.contract_awards_filter,2000
            );
            console.log(
              `Fetched ${CaData.result} contract awards for customer ${element._id}.`
            );

            const regionsCaDataArray = [];
            CaData.result.map(function (obj) {
              let index = regionsCaDataArray.findIndex(
                (a) => a.regions === obj.regions
              );

              if (index >= 0) {
                regionsCaDataArray[index].data.push({
                  country: obj.country,
                  description: obj.description,
                });
              } else {
                regionsCaDataArray.push({
                  regions: obj.regions,
                  data: [
                    {
                      country: obj.country,
                      description: obj.description,
                    },
                  ],
                });
              }
            });

            console.log(
              `Sending contract awards data email to ${element.email}...`
            );
            sendCaDataMail(
              CaData?.result || [],
              element._id,
              element.full_name,
              element.email,
              regionsCaDataArray,
              pendingDays
            );
            console.log(
              `Email sent for contract awards data to ${element.email}.`
            );
          }
        } else {
          console.log(
            `Plan expired for customer ${element.full_name} (ID: ${element._id}). Skipping.`
          );
        }
      } else {
        console.log(
          `No plan found or invalid plan for customer ${element.full_name} (ID: ${element._id}). Skipping.`
        );
      }
    }

    console.log("Cron job completed.");
  } catch (error) {
    console.error("Error in cron job:", error.message);
    throw new Error(error.message);
  }
});

// this cron is about to send the daily reports to the roles based admin users not customer

cron.schedule("0 0 * * *", async function () {
  // midnight
  // cron.schedule('1 * * * * *', async function () {     // testing
  try {
    console.log("running cron...");

    // sector data
    const sectorData = await readAllSectors(
      { is_active: true },
      { name: 1 },
      { ["name"]: 1 },
      0,
      2000
    );

    const regionsData = await readAllRegions(
      { is_active: true },
      { name: 1 },
      { ["name"]: 1 },
      0,
      2000
    );

    let date = new Date();
    date.setDate(date.getDate() - 1);
    let start_date = new Date(format(date, "MM/dd/yyyy") + " 00:00:00");
    let end_date = new Date(format(date, "MM/dd/yyyy") + " 23:59:59");

    let filter = {
      is_active: true,
      is_deleted: false,
      createdAt: {
        $gte: start_date,
        $lt: end_date,
      },
    };

    const yesterdayTenderData = await readAllTenders(
      filter,
      { sectors: 1, regions: 1, createdAt: 1 },
      { ["createdAt"]: 1 },
      0,
      1000
    );

    const yesterdayGrantsData = await readAllGrants(
      filter,
      { sectors: 1, regions: 1, createdAt: 1 },
      { ["createdAt"]: 1 },
      0,
      1000
    );

    const yesterdayProjectsData = await readAllProjects(
      filter,
      { sectors: 1, regions: 1, createdAt: 1 },
      { ["createdAt"]: 1 },
      0,
      1000
    );

    const yesterdayContractData = await readAllContractAward(
      filter,
      { sectors: 1, regions: 1, createdAt: 1 },
      { ["createdAt"]: 1 },
      0,
      1000
    );

    let header = [
      {
        id: "sector",
        title: "Sector",
      },
    ];

    for (let index = 0; index < regionsData.result.length; index++) {
      const element = regionsData.result[index];

      const name = element.name.replace(/\s+/g, "_");

      header.push({
        id: name,
        title: element.name,
      });
    }

    let content = [];

    for (let j = 0; j < sectorData.result.length; j++) {
      const jElement = sectorData.result[j];
      let contentObj = {
        sector: jElement.name,
      };

      for (let index = 0; index < header.length; index++) {
        const element = header[index];

        if (index > 0) {
          let string = "";

          let tenders = yesterdayTenderData.result.filter(
            (obj) =>
              obj.sectors === jElement.name && obj.regions === element.title
          );
          string += `Tenders - ${tenders.length || 0}`;
          let projects = yesterdayProjectsData.result.filter(
            (obj) =>
              obj.sectors === jElement.name && obj.regions === element.title
          );
          string += ` / Projects - ${projects.length || 0}`;
          let grants = yesterdayGrantsData.result.filter(
            (obj) =>
              obj.sectors === jElement.name && obj.regions === element.title
          );
          string += ` / Grants - ${grants.length || 0}`;
          let contract = yesterdayContractData.result.filter(
            (obj) =>
              obj.sectors === jElement.name && obj.regions === element.title
          );
          string += ` / Contract Awards - ${contract.length || 0}`;

          contentObj[element.id] = string;
        }
      }

      content.push(contentObj);
    }

    let path = `public/reports/`;
    let filename = `${format(new Date(), "MMddyyyy")}.csv`;

    const writer = createObjectCsvWriter({
      path: path + filename,
      header: header,
    });

    writer.writeRecords(content).then(() => {
      console.log("Done!");
    });

    let payload = {
      from_date: start_date,
      to_date: end_date,
      download_url: BASE_URL + path + filename,
      type: "Daily",
      stats: "Success",
    };

    await createReports(payload);

    const contents = fs.readFileSync(path + filename, { encoding: "base64" });

    let mailRes = await sendEMAIL(
      ADMIN_EMAIL,
      "Daily Reports - Bidsinfoglobal",
      "",
      "<p>Daily Reports</p>",
      [
        {
          content: contents,
          mime_type: "plain/text",
          name: filename,
        },
      ]
    );

    console.log(mailRes, "Reports Send Mail Console");
  } catch (error) {
    throw new Error(error);
  }
});
