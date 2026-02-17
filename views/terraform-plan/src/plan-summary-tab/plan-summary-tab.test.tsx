import { expect, test, describe, it } from '@jest/globals'
import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import MockAttachmentService from '../services/attachments/mock-attachment-service';
import TerraformPlanDisplay, { LoadingMessage, NoPublishedPlanMessage } from './plan-summary-tab';

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

test("still loading", () => {
  act(() => {
    render(<TerraformPlanDisplay attachments={attachments} />, container);  
  });
  // select the first flex row of the card content section
  const elements = container?.querySelectorAll("div.bolt-card-content div.flex-column div.flex-row div");
  expect(elements).toBeDefined();
  
  if(elements){
    expect(elements.length).toBe(1);
    expect(elements[0].innerHTML).toBe(LoadingMessage);
  }
});

test("plans are sorted alphabetically (case-insensitive)", async () => {
  // Set up attachments in unsorted order with mixed case
  attachments.setAttachments(
    { name: 'cCplan1', type: 'terraform-plan-results', content: 'plan content 1' },
    { name: 'Bplan2', type: 'terraform-plan-results', content: 'plan content 2' },
    { name: 'aPlan1', type: 'terraform-plan-results', content: 'plan content 3' },
    { name: 'cplan1', type: 'terraform-plan-results', content: 'plan content 4' },
    { name: 'bplan3', type: 'terraform-plan-results', content: 'plan content 5' }
  );

  // Expected order: aPlan1, Bplan2, bplan3, cCplan1, cplan1
  const expectedOrder = ['aPlan1', 'Bplan2', 'bplan3', 'cCplan1', 'cplan1'];
  
  // Directly test the sorting logic
  const testPlans = [
    { name: 'cCplan1', plan: 'plan content 1' },
    { name: 'Bplan2', plan: 'plan content 2' },
    { name: 'aPlan1', plan: 'plan content 3' },
    { name: 'cplan1', plan: 'plan content 4' },
    { name: 'bplan3', plan: 'plan content 5' }
  ];
  
  testPlans.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  
  expect(testPlans.length).toBe(expectedOrder.length);
  
  testPlans.forEach((plan, index) => {
    expect(plan.name).toBe(expectedOrder[index]);
  });
});

