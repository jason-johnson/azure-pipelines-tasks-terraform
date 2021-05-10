import { expect, test, describe, it } from '@jest/globals'
import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import MockAttachmentService from '../services/attachments/mock-attachment-service';
import TerraformPlanDisplay, { NoPublishedPlanMessage } from './plan-summary-tab';

let container: HTMLDivElement | null;
let attachments: MockAttachmentService;

beforeEach(() => {
  container = document.createElement("div");
  container.id = "root";
  document.body.appendChild(container);
  attachments = new MockAttachmentService();
});

afterEach(() => {
  if(container){    
    unmountComponentAtNode(container);
    container.remove();
  }
  container = null;
})

test("no plans have been published", () => {
  act(() => {
    render(<TerraformPlanDisplay attachments={attachments} />, container);  
  });
  // select the first flex row of the card content section
  const elements = container?.querySelectorAll("div.bolt-card-content div.flex-column div.flex-row div");
  expect(elements).toBeDefined();
  
  if(elements){
    expect(elements.length).toBe(1);
    expect(elements[0].innerHTML).toBe(NoPublishedPlanMessage);
  }
});

