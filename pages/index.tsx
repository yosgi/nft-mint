import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { JsonRpcSigner } from "@ethersproject/providers";
import { ethers } from "ethers";
import Box from '@mui/material/Box';
import { contractABI } from '../constant'
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button';
import { useEthers, useEtherBalance } from "@usedapp/core";
import Slider from '@mui/material/Slider';
import Card  from '@mui/material/Card';
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
const Home: NextPage = () => {
  const [value, setValue] = React.useState<number>(1);
  const { activateBrowserWallet, account, library } = useEthers();
  const [signer, setSigner] = React.useState<undefined | JsonRpcSigner>(undefined);
  const handleWithdraw = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    // Get signer
    if (account) {
      let contract = new ethers.Contract("0x486C233D946837b17749F5279d7c3e40d7b694f1", contractABI, signer);
      console.log(contract)
      let res = await contract.mint(value,{ gasLimit: 2100000,value: ethers.utils.parseEther(value * 0.03 + "") })
      console.log(res)
    }
    
}
  React.useEffect(() => {
    if (account) {
      console.log(library?.getSigner())
      // @ts-ignore
      setSigner(library?.getSigner());
    } else {
      // Deactivate signer if signed out
      setSigner(undefined);
    }
  }, [account]);
  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };
  const handleConnect = () => {
    activateBrowserWallet();
  }
  function valuetext(value: number) {
    return `${value}`;
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Mint NFT</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppBar position="static">
          <Toolbar sx={{display:'flex',justifyContent:'space-between'}}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              Mint NFT
            </IconButton>
            {account ? `${account.slice(0, 6)}...${account.slice(
                account.length - 4,
                account.length
              )}`:
                <div style={{display:'flex'}}>
                    <Button color="inherit" onClick={handleConnect}>Connect</Button>
                </div>
              }
           
          </Toolbar>
          
        
      </AppBar>
      <Box sx={{padding:4,fontSize:30}}>  
            <Box component="div" sx={{ marginBottom:4 }}>
               Mint Price per token: 0.3 ETH
            </Box>
            <Box sx={{ marginBottom:4 }}>
                Maxium token per mint: 4
            </Box>
            <Box sx={{ marginBottom:4 }}>
            <Box>
              Mint count: {value}
            </Box>
            <Slider  onChange={handleChange} sx={{width:320}} defaultValue={1} step={1} marks min={1} max={4} getAriaValueText={valuetext} valueLabelDisplay="auto" />
            
            </Box>
            <Button variant="contained" sx={{width:120,height:40}} onClick={handleWithdraw}>Mint</Button>
    
      </Box>
    </div>
  )
}

export default Home