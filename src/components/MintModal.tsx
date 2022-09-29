import React, { useContext, useEffect } from 'react';
import { Modal } from 'antd';
import styled from 'styled-components';
import { useAnalytics } from 'src/views/_global/AnalyticsProvider';
import dynamic from 'next/dynamic';
import { holaSignMetadata } from '@/modules/storefront/approve-nft';
import { useScrollBlock } from '@/hooks/useScrollBlock';
import { BulkMinter as TBulkMinter } from 'cherry-holaplex-ui';
import { Connection } from '@solana/web3.js';
import { StorefrontContext } from '@/modules/storefront';
import { useRouter } from 'next/router';
import { useWallet } from '@solana/wallet-adapter-react';

const BulkMinter = dynamic(() => import('cherry-holaplex-ui').then((mod) => mod.BulkMinter), {
  ssr: false,
}) as typeof TBulkMinter;

const StyledModal = styled(Modal)`
  margin: 0;
  top: 0;
  padding: 0;
  min-height: 100vh;

  .ant-modal-body {
    padding: 0;
  }

  .ant-modal-content {
    width: 100vw;
    min-height: 100vh;
    overflow-y: scroll;
    margin: 0;
    top: 0;
    background-color: #000;
  }

  .ant-modal-wrap {
    overflow-x: hidden;
  }
`;

interface MintModalProps {
  show: boolean;
  onClose: () => void;
}

const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_ENDPOINT as string);

const MintModal = ({ show, onClose }: MintModalProps) => {
  const { track } = useAnalytics();
  const router = useRouter();
  const [blockScroll, allowScroll] = useScrollBlock();
  const { storefront } = useContext(StorefrontContext);
  const wallet = useWallet();

  useEffect(() => {
    if (show) {
      blockScroll();
    } else {
      allowScroll();
    }
  }, [show, blockScroll, allowScroll]);

  return (
    <StyledModal
      destroyOnClose
      footer={[]}
      onCancel={() => {
        allowScroll();
        onClose();
      }}
      visible={show}
      width="100%"
      bodyStyle={{ height: '100%' }}
      closable={false}
      maskStyle={{ overflowX: 'hidden' }}
      wrapProps={{ style: { overflowX: 'hidden' } }}
    >
      <BulkMinter
        goToOwnedRoute={() => router.push(`/profiles/${wallet?.publicKey?.toBase58()}/created`)}
        wallet={wallet}
        wallets={wallet.wallets} // ksy 0929
        track={track}
        storefront={storefront}
        holaSignMetadata={holaSignMetadata}
        onClose={() => {
          allowScroll();
          onClose();
        }}
        connection={connection}
      />
    </StyledModal>
  );
};
export default MintModal;
