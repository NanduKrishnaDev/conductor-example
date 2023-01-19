import { useState, useEffect, useRef } from 'react';
import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import {
  orkesConductorClient,
  WorkflowExecutor,
  TaskType,
} from "@io-orkes/conductor-javascript";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();


export default function Home() {

  const [execId, setExecid] = useState(null);
  const timerRef = useRef(null);


  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const queryStatus = async () => {
      const client = await clientPromise;
      const workflowStatus = await client.workflowResource.getExecutionStatus(
        execId,
        true
      );
      if (
        ["COMPLETED", "FAILED", "TERMINATED"].includes(workflowStatus.status)
      ) {
        console.log(workflowStatus);
        clearTimeout(timerRef.current);
        setExecid(null);
      }
    }
    if (execId) {
      timerRef.current = setInterval(() => {
        queryStatus();
      }, 1000);
    }
  }, [execId])

  useEffect(() => {
    return clearTimeout(timerRef.current);
  }, []);

  // Create the client with our properties in the next file
  const clientPromise = orkesConductorClient(publicRuntimeConfig.conductor);

  const handleClick = () => {
    const click = async () => {
      const client = await clientPromise;
      // Create an instance of a workflow executor
      const executor = new WorkflowExecutor(client);
      // using the executor helper start the workflow
      const executionId = await executor.startWorkflow({
        name: publicRuntimeConfig.workflows.checkout,
        version: 1,
        // input: {
        //   products,
        //   availableCredit: availableBalance,
        // },
        correlationId: "myCoolUser",
      });
      setExecid(executionId);
    };
    click();
  };


  return (
    <>
      <Head>
        <title>List | Home</title>
        <meta name="keywords" content="ninjas" />
      </Head>
      <div>
        <h1 className={styles.title}>Homepage</h1>
        <p className={styles.text}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus animi impedit suscipit architecto, odio inventore nostrum non neque dicta. Quam magni accusantium culpa distinctio tempore iure accusamus, dolorem nobis odit.</p>
        <p className={styles.text}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus animi impedit suscipit architecto, odio inventore nostrum non neque dicta. Quam magni accusantium culpa distinctio tempore iure accusamus, dolorem nobis odit.</p>
        <a className={styles.btn} onClick={handleClick}>See Listing</a>
      </div>
    </>
  )
}